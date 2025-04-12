import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { MaxInt } from "@spotify/web-api-ts-sdk";
import type { SpotifyMCPClient } from "./spotify.js";

// Create server instance
export function initServer(client: SpotifyMCPClient): McpServer {
	const server = new McpServer({
		name: "spotify-mcp-playlist",
		version: "1.0.0",
		capabilities: {
			tools: {},
		},
	});

	// Get user profile tool
	server.tool(
		"get-spotify-profile",
		"Get the current user's Spotify profile",
		{},
		async () => {
			try {
				const profile = await client.getCurrentUserProfile();
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(profile, null, 2),
						},
					],
				};
			} catch (error) {
				return {
					content: [
						{
							type: "text",
							text: `Error: ${
								error instanceof Error ? error.message : String(error)
							}`,
						},
					],
				};
			}
		}
	);

	// Get playlist items tool
	server.tool(
		"get-spotify-playlist-items",
		"Get items from a specific Spotify playlist",
		{
			playlistId: z.string().describe("The Spotify playlist ID"),
		},
		async ({ playlistId }) => {
			try {
				const items = await client.getPlaylistItems(playlistId);
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(items, null, 2),
						},
					],
				};
			} catch (error) {
				return {
					content: [
						{
							type: "text",
							text: `Error: ${
								error instanceof Error ? error.message : String(error)
							}`,
						},
					],
				};
			}
		}
	);

	// Get user playlists tool
	server.tool(
		"get-spotify-playlists",
		"Get the current user's Spotify playlists",
		{
			limit: z
				.number()
				.min(1)
				.max(50)
				.default(20)
				.describe("Number of playlists to fetch (max 50)"),
			offset: z.number().min(0).default(0).describe("Offset for pagination"),
		},
		async ({ limit, offset }) => {
			try {
				const playlists = await client.getUserPlaylists(
					limit as MaxInt<50>,
					offset
				);
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(playlists, null, 2),
						},
					],
				};
			} catch (error) {
				return {
					content: [
						{
							type: "text",
							text: `Error: ${
								error instanceof Error ? error.message : String(error)
							}`,
						},
					],
				};
			}
		}
	);

	// Search Spotify tool
	server.tool(
		"search-spotify",
		"Search for content on Spotify",
		{
			query: z.string().describe("Search query"),
			types: z
				.array(z.enum(["album", "artist", "playlist", "track"]))
				.default(["track"])
				.describe("Types of items to search for"),
			limit: z
				.number()
				.min(1)
				.max(50)
				.default(20)
				.describe("Number of results to return per type (max 50)"),
			offset: z.number().min(0).default(0).describe("Offset for pagination"),
		},
		async ({ query, types, limit, offset }) => {
			try {
				const results = await client.search(
					query,
					types,
					limit as MaxInt<50>,
					offset
				);
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(results, null, 2),
						},
					],
				};
			} catch (error) {
				return {
					content: [
						{
							type: "text",
							text: `Error: ${
								error instanceof Error ? error.message : String(error)
							}`,
						},
					],
				};
			}
		}
	);

	// Update playlist items tool
	server.tool(
		"update-spotify-playlist",
		"Update the tracks in a Spotify playlist",
		{
			playlistId: z.string().describe("The Spotify playlist ID"),
			uris: z
				.array(z.string())
				.describe("Array of Spotify track URIs to add to the playlist"),
		},
		async ({ playlistId, uris }) => {
			try {
				const snapshotId = await client.updatePlaylistItems(playlistId, {
					uris,
				});
				return {
					content: [
						{
							type: "text",
							text: `Successfully updated playlist. Snapshot ID: ${snapshotId}`,
						},
					],
				};
			} catch (error) {
				return {
					content: [
						{
							type: "text",
							text: `Error: ${
								error instanceof Error ? error.message : String(error)
							}`,
						},
					],
				};
			}
		}
	);

	return server;
}
