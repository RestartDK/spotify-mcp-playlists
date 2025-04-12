import { MaxInt, SpotifyApi, UserProfile, type SearchResults } from "@spotify/web-api-ts-sdk";

if (!process.env.CLIENT_SECRET) {
	throw new Error("Need to set CLIENT_SECRET environment variable");
}
if (!process.env.CLIENT_ID) {
	throw new Error("Need to set CLIENT_ID environment variable");
}
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const CLIENT_ID = process.env.CLIENT_ID;

const sdk = SpotifyApi.withClientCredentials(CLIENT_ID, CLIENT_SECRET, [
	"user-read-private",
	"user-read-email",
	"playlist-read-private",
]);

export async function getCurrentUserProfile(): Promise<UserProfile> {
	try {
		const user = await sdk.currentUser.profile();

		if (!user) {
			throw new Error("User profile not found");
		}

		return user;
	} catch (error) {
		throw new Error(
			`Failed to fetch user profile: ${
				error instanceof Error ? error.message : String(error)
			}`
		);
	}
}

export async function getPlaylistItems(playlistId: string) {
	try {
		const playlistItems = await sdk.playlists.getPlaylistItems(playlistId);
		return playlistItems;
	} catch (error) {
		throw new Error(
			`Failed to fetch playlist: ${
				error instanceof Error ? error.message : String(error)
			}`
		);
	}
}

export async function getPlaylist(playlistId: string) {
	try {
		const playlist = await sdk.playlists.getPlaylist(playlistId);
		return playlist;
	} catch (error) {
		throw new Error(
			`Failed to fetch playlist: ${
				error instanceof Error ? error.message : String(error)
			}`
		);
	}
}

export async function getUserPlaylists(limit: MaxInt<50>, offset: number) {
	try {
		const playlists = await sdk.currentUser.playlists.playlists(limit, offset);
		return playlists;
	} catch (error) {
		throw new Error(
			`Failed to fetch playlists: ${
				error instanceof Error ? error.message : String(error)
			}`
		);
	}
}

interface PlaylistItemsUpdate {
  uris: string[]
}

export async function updatePlaylistItems(playlistId: string, request: PlaylistItemsUpdate): Promise<string> {
	try {
		const { snapshot_id} = await sdk.playlists.updatePlaylistItems(playlistId, request);
		return snapshot_id;
	} catch (error) {
		throw new Error(
			`Failed to fetch playlists: ${
				error instanceof Error ? error.message : String(error)
			}`
		);
	}
}

export async function search(
	query: string,
	types: Array<"album" | "artist" | "playlist" | "track"> = ["track"],
	limit: MaxInt<50> = 20,
	offset = 0
) {
	try {
		const results = await sdk.search(
			query,
			types,
			undefined, // market parameter - undefined means all markets
			limit,
			offset
		);
		return results;
	} catch (error) {
		throw new Error(
			`Failed to search Spotify: ${
				error instanceof Error ? error.message : String(error)
			}`
		);
	}
}