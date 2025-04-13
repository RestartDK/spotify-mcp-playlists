import { SpotifyApi, } from "@spotify/web-api-ts-sdk";
import path from 'path';
import fs from 'fs';
import os from 'os';
export class SpotifyMCPClient {
    client;
    static CREDENTIALS_PATH = path.join(os.homedir(), '.spotify-mcp-credentials.json');
    constructor(clientId, clientSecret) {
        if (!clientId || !clientSecret)
            throw new Error("Please input client id or client secret");
        // Load credentials if they exist
        if (!fs.existsSync(SpotifyMCPClient.CREDENTIALS_PATH)) {
            throw new Error(`No credentials found at ${SpotifyMCPClient.CREDENTIALS_PATH}. ` +
                `Please run the auth server first and authorize.`);
        }
        try {
            const credentials = JSON.parse(fs.readFileSync(SpotifyMCPClient.CREDENTIALS_PATH, 'utf-8'));
            this.client = SpotifyApi.withAccessToken(clientId, credentials);
        }
        catch (error) {
            throw new Error(`Failed to load credentials from ${SpotifyMCPClient.CREDENTIALS_PATH}: ` +
                `${error instanceof Error ? error.message : String(error)}`);
        }
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
    async createPlaylist(name, description, isPublic = true) {
        try {
            const user = await this.getCurrentUserProfile();
            const playlist = await this.client.playlists.createPlaylist(user.id, {
                name,
                description,
                public: isPublic
            });
            return playlist;
        }
        catch (error) {
            throw new Error(`Failed to create playlist: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}
