/**
 * Axiom UI MCP server (stdio). Exposes two tools:
 *   - list_components: name + intent for every component
 *   - get_component:   full .tsx source + structured manifest
 * The design deliberately omits write tools — side effects are the CLI's job.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { componentSource, loadManifests } from "../cli/manifests.js";

export async function runMcp(): Promise<void> {
  const server = new Server(
    { name: "axiom-ui", version: "0.2.0" },
    { capabilities: { tools: {} } },
  );

  server.setRequestHandler(ListToolsRequestSchema, () => ({
    tools: [
      {
        name: "list_components",
        description:
          "List every Axiom UI component with its short intent. Use this first to discover what's available.",
        inputSchema: { type: "object", properties: {}, additionalProperties: false },
      },
      {
        name: "get_component",
        description:
          "Return the full .tsx source and the structured manifest for a single component. Read this before generating code that uses the component.",
        inputSchema: {
          type: "object",
          properties: {
            name: { type: "string", description: "Component name (e.g. \"button\")" },
          },
          required: ["name"],
          additionalProperties: false,
        },
      },
    ],
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const manifests = loadManifests();

    if (request.params.name === "list_components") {
      const components = Object.entries(manifests).map(([name, manifest]) => ({
        name,
        intent: manifest.intent,
      }));
      return {
        content: [{ type: "text", text: JSON.stringify({ components }, null, 2) }],
      };
    }

    if (request.params.name === "get_component") {
      const name = (request.params.arguments as { name?: string } | undefined)?.name;
      if (!name || !(name in manifests)) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Unknown component "${name}". Call list_components for available names.`,
            },
          ],
        };
      }
      const payload = {
        name,
        source: componentSource(name),
        manifest: manifests[name],
      };
      return {
        content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
      };
    }

    return {
      isError: true,
      content: [{ type: "text", text: `Unknown tool: ${request.params.name}` }],
    };
  });

  await server.connect(new StdioServerTransport());
}
