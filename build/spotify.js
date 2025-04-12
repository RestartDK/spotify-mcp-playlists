import { SpotifyApi, } from "@spotify/web-api-ts-sdk";
export class SpotifyMCPClient {
    client;
    constructor(clientId, clientSecret) {
        if (!clientId || !clientSecret)
            throw new Error("Please input client id or client secret");
        // Initialize with authorization code flow for user-specific data access
        this.client = SpotifyApi.withUserAuthorization(clientId, "http://localhost:8888/callback", [
            "user-read-private",
            "user-read-email",
            "playlist-read-private",
            "playlist-modify-public",
            "playlist-modify-private",
        ]);
    }
    async getCurrentUserProfile() {
        try {
            const user = await this.client.currentUser.profile();
            if (!user) {
                throw new Error("User profile not found");
            }
            return user;
        }
        catch (error) {
            throw new Error(`Failed to fetch user profile: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    async getPlaylistItems(playlistId) {
        try {
            const playlistItems = await this.client.playlists.getPlaylistItems(playlistId);
            return playlistItems;
        }
        catch (error) {
            throw new Error(`Failed to fetch playlist: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    async getPlaylist(playlistId) {
        try {
            const playlist = await this.client.playlists.getPlaylist(playlistId);
            return playlist;
        }
        catch (error) {
            throw new Error(`Failed to fetch playlist: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    async getUserPlaylists(limit, offset) {
        try {
            const playlists = await this.client.currentUser.playlists.playlists(limit, offset);
            return playlists;
        }
        catch (error) {
            throw new Error(`Failed to fetch playlists: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    async updatePlaylistItems(playlistId, request) {
        try {
            const { snapshot_id } = await this.client.playlists.updatePlaylistItems(playlistId, request);
            return snapshot_id;
        }
        catch (error) {
            throw new Error(`Failed to update playlist: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    async search(query, types = ["track"], limit = 20, offset = 0) {
        try {
            const results = await this.client.search(query, types, undefined, // market parameter - undefined means all markets
            limit, offset);
            return results;
        }
        catch (error) {
            throw new Error(`Failed to search Spotify: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}
