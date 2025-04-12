import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { initServer } from "./server.js";
import { SpotifyMCPClient } from "./spotify.js";
function parseArgs() {
    const args = process.argv.slice(2);
    const config = {};
    for (let i = 0; i < args.length; i += 2) {
        if (args[i].startsWith("--")) {
            const key = args[i].slice(2).replace(/-/g, "_").toUpperCase();
            config[key] = args[i + 1];
        }
    }
    return config;
}
async function main() {
    try {
        // Parse command line arguments and set them as environment variables
        const config = parseArgs();
        // Initialise spotify client
        const spotifyClient = new SpotifyMCPClient(config.CLIENT_ID, config.CLIENT_SECRET);
        // Initialize and start MCP server
        const server = initServer(spotifyClient);
        const transport = new StdioServerTransport();
        await server.connect(transport);
        console.error("Spotify MCP Server running on stdio");
    }
    catch (error) {
        console.error("Error initializing server:", error);
        process.exit(1);
    }
}
main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
