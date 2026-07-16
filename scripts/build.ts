/**
 * Build the publishable package artifacts.
 *
 *   1. Copy src/components/*.tsx (excluding *.test.tsx) into templates/
 *      — verbatim, so users can copy & own the same file the LLM saw.
 *   2. Parse each component with TypeScript's AST, extract the
 *      `export const manifest = { ... } as const` initializer, and
 *      write manifests.json for the CLI/MCP runtime.
 *   3. Compile cli/ and mcp/ into dist/ via tsc.
 */
import { execFileSync } from "node:child_process";
import { copyFileSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";

const root = join(import.meta.dirname, "..");
const componentsDir = join(root, "src/components");
const templatesDir = join(root, "templates");
const manifestsPath = join(root, "manifests.json");
const distDir = join(root, "dist");

rmSync(templatesDir, { recursive: true, force: true });
mkdirSync(templatesDir, { recursive: true });
rmSync(distDir, { recursive: true, force: true });

const componentFiles = readdirSync(componentsDir)
  .filter((file) => file.endsWith(".tsx") && !file.endsWith(".test.tsx"))
  .sort();

const manifests: Record<string, unknown> = {};

for (const file of componentFiles) {
  const source = readFileSync(join(componentsDir, file), "utf8");
  copyFileSync(join(componentsDir, file), join(templatesDir, file));

  const sourceFile = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const manifest = extractManifest(sourceFile);
  if (manifest === undefined) {
    console.error(`${file}: no exported \`manifest\` found`);
    process.exit(1);
  }
  const name = file.replace(/\.tsx$/, "");
  manifests[name] = manifest;
}

writeFileSync(manifestsPath, JSON.stringify(manifests, null, 2) + "\n");
console.log(`templates/ ← ${componentFiles.length} components`);
console.log(`manifests.json ← ${Object.keys(manifests).length} manifests`);

execFileSync("pnpm", ["exec", "tsc", "-p", "tsconfig.cli.json"], { stdio: "inherit", cwd: root });
console.log("dist/ ← tsc build");

function extractManifest(sourceFile: ts.SourceFile): unknown {
  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    const isExported = statement.modifiers?.some(
      (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
    );
    if (!isExported) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (!ts.isIdentifier(declaration.name) || declaration.name.text !== "manifest") continue;
      let initializer = declaration.initializer;
      if (initializer && ts.isAsExpression(initializer)) {
        initializer = initializer.expression;
      }
      if (!initializer || !ts.isObjectLiteralExpression(initializer)) return undefined;
      return evaluateLiteral(initializer);
    }
  }
  return undefined;
}

function evaluateLiteral(node: ts.Node): unknown {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return node.text;
  }
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (node.kind === ts.SyntaxKind.NullKeyword) return null;
  if (ts.isArrayLiteralExpression(node)) {
    return node.elements.map(evaluateLiteral);
  }
  if (ts.isObjectLiteralExpression(node)) {
    const obj: Record<string, unknown> = {};
    for (const property of node.properties) {
      if (!ts.isPropertyAssignment(property)) continue;
      const key = property.name;
      let keyText: string | undefined;
      if (ts.isIdentifier(key)) keyText = key.text;
      else if (ts.isStringLiteral(key)) keyText = key.text;
      else if (ts.isNoSubstitutionTemplateLiteral(key)) keyText = key.text;
      if (keyText === undefined) continue;
      obj[keyText] = evaluateLiteral(property.initializer);
    }
    return obj;
  }
  if (ts.isAsExpression(node) || ts.isParenthesizedExpression(node)) {
    return evaluateLiteral(node.expression);
  }
  throw new Error(`Unsupported manifest literal: ${ts.SyntaxKind[node.kind]}`);
}
