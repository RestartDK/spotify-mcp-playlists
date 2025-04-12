import {
	MaxInt,
	SpotifyApi,
	UserProfile,
	type SearchResults,
} from "@spotify/web-api-ts-sdk";

interface PlaylistItemsUpdate {
	uris: string[];
}

export class SpotifyMCPClient {
	public client: SpotifyApi;

	constructor(clientId: string, clientSecret: string) {
		if (!clientId || !clientSecret)
			throw new Error("Please input client id or client secret");

		this.client = SpotifyApi.withClientCredentials(clientId, clientSecret, [
			"user-read-private",
			"user-read-email",
			"playlist-read-private",
			"playlist-read-private",
			"playlist-modify-public",
			"playlist-modify-private",
		]);
	}

	async getCurrentUserProfile(): Promise<UserProfile> {
		try {
			const user = await this.client.currentUser.profile();

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

	async getPlaylistItems(playlistId: string) {
		try {
			const playlistItems = await this.client.playlists.getPlaylistItems(
				playlistId
			);
			return playlistItems;
		} catch (error) {
			throw new Error(
				`Failed to fetch playlist: ${
					error instanceof Error ? error.message : String(error)
				}`
			);
		}
	}

	async getPlaylist(playlistId: string) {
		try {
			const playlist = await this.client.playlists.getPlaylist(playlistId);
			return playlist;
		} catch (error) {
			throw new Error(
				`Failed to fetch playlist: ${
					error instanceof Error ? error.message : String(error)
				}`
			);
		}
	}

	async getUserPlaylists(limit: MaxInt<50>, offset: number) {
		try {
			const playlists = await this.client.currentUser.playlists.playlists(
				limit,
				offset
			);
			return playlists;
		} catch (error) {
			throw new Error(
				`Failed to fetch playlists: ${
					error instanceof Error ? error.message : String(error)
				}`
			);
		}
	}

	async updatePlaylistItems(
		playlistId: string,
		request: PlaylistItemsUpdate
	): Promise<string> {
		try {
			const { snapshot_id } = await this.client.playlists.updatePlaylistItems(
				playlistId,
				request
			);
			return snapshot_id;
		} catch (error) {
			throw new Error(
				`Failed to update playlist: ${
					error instanceof Error ? error.message : String(error)
				}`
			);
		}
	}

	async search(
		query: string,
		types: Array<"album" | "artist" | "playlist" | "track"> = ["track"],
		limit: MaxInt<50> = 20,
		offset = 0
	) {
		try {
			const results = await this.client.search(
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
}
