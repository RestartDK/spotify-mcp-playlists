#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { initServer } from "./server.js";
import { SpotifyMCPClient } from "./spotify.js";

async function main() {
	try {
		// Parse command line arguments
		const args = process.argv.slice(2);
		let clientId: string | undefined;
		let clientSecret: string | undefined;

		for (let i = 0; i < args.length; i++) {
			if (args[i] === '--client-id' && i + 1 < args.length) {
				clientId = args[i + 1];
			}
			if (args[i] === '--client-secret' && i + 1 < args.length) {
				clientSecret = args[i + 1];
			}
		}

		if (!clientId || !clientSecret) {
			throw new Error("Missing --client-id or --client-secret arguments");
		}

		// Initialize spotify client
		const spotifyClient = new SpotifyMCPClient(clientId, clientSecret);

		// Initialize and start MCP server
		const server = initServer(spotifyClient);
		const transport = new StdioServerTransport();
		await server.connect(transport);
		console.error("Spotify MCP Server running on stdio");
	} catch (error) {
		console.error("Error initializing server:", error);
		process.exit(1);
	}
}

main().catch((error) => {
	console.error("Fatal error in main():", error);
	process.exit(1);
});
