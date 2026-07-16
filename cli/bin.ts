#!/usr/bin/env node
/**
 * axiom-ui CLI entry. One binary, three subcommands: add, list, mcp.
 */
import { runAdd } from "./add.js";
import { runList } from "./list.js";

const [subcommand, ...rest] = process.argv.slice(2);

switch (subcommand) {
  case "add":
    runAdd(rest);
    break;
  case "list":
    runList();
    break;
  case "mcp": {
    const { runMcp } = await import("../mcp/server.js");
    await runMcp();
    break;
  }
  case undefined:
  case "-h":
  case "--help":
    printHelp();
    break;
  default:
    console.error(`Unknown subcommand: ${subcommand}\n`);
    printHelp();
    process.exit(1);
}

function printHelp(): void {
  console.log(
    [
      "axiom-ui — copy-and-own React UI components designed for LLMs.",
      "",
      "Usage:",
      "  axiom-ui list                          List available components.",
      "  axiom-ui add <name> [--dir <path>]     Copy a component into your repo.",
      "                     [--force]           Overwrite an existing file.",
      "  axiom-ui mcp                           Start the MCP server on stdio.",
      "",
      "Default --dir is ./src/components.",
    ].join("\n"),
  );
}
