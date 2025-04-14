# Spotify MCP Playlist

<p align="center">
  <img src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_Green.png" width="250" alt="Spotify Logo">
</p>

A [Model Context Protocol (MCP)](https://github.com/gnehs/modelcontextprotocol) server for interacting with Spotify playlists. This server allows AI assistants to manage your Spotify playlists through the MCP standard.

## Features

- 🎵 Get user profile information
- 📋 List user's playlists
- 🔍 Search for tracks, albums, artists, and playlists
- 📝 Create new playlists
- ➕ Add tracks to playlists
- 🔄 Get playlist details

## Prerequisites

- Node.js (v16+)
- A Spotify Developer account
- Spotify API credentials (Client ID and Client Secret)

## Installation

### Via npm/npx (Recommended)

You can install the package globally:

```bash
npm install -g spotify-mcp-playlist
```

Or use it directly with npx without installing:

```bash
# Authentication
npx spotify-mcp-auth --client-id YOUR_CLIENT_ID --client-secret YOUR_CLIENT_SECRET

# MCP Server
npx spotify-mcp-playlist --client-id YOUR_CLIENT_ID --client-secret YOUR_CLIENT_SECRET 
```

### From Source

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/spotify-mcp-playlist.git
   cd spotify-mcp-playlist
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Build the project:
   ```
   npm run build
   ```

## Setting Up Your Spotify Application

1. Visit the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/) and log in with your Spotify account.

2. Click the "Create app" button.

3. Fill in the application details:
   - **App name**: Choose a name (e.g., "MCP Playlist Manager")
   - **App description**: Brief description of your app
   - **Redirect URI**: Add `http://127.0.0.1:8888/callback`

4. After creating the app, you'll be taken to your app's dashboard.

5. You'll see your **Client ID** displayed on this page.

6. Click "Show Client Secret" to reveal your **Client Secret**.

7. Keep these credentials secure and don't share them publicly.

8. In the app settings, make sure the Redirect URI is properly set to `http://127.0.0.1:8888/callback`.

## Authentication

Before using the MCP server, you need to authenticate with Spotify:

1. Run the authentication server:
   
   If installed globally:
   ```bash
   spotify-mcp-auth --client-id YOUR_CLIENT_ID --client-secret YOUR_CLIENT_SECRET
   ```
   
   With npx:
   ```bash
   npx spotify-mcp-auth --client-id YOUR_CLIENT_ID --client-secret YOUR_CLIENT_SECRET
   ```
   
   From source:
   ```bash
   node build/auth.js --client-id YOUR_CLIENT_ID --client-secret YOUR_CLIENT_SECRET
   ```

2. Your browser will open automatically. Log in to Spotify and authorize the application.

3. After successful authorization, your credentials will be saved to `~/.spotify-mcp-credentials.json`.

## Usage

### Starting the MCP Server

If installed globally:
```bash
spotify-mcp-playlist --client-id YOUR_CLIENT_ID --client-secret YOUR_CLIENT_SECRET --stdio
```

With npx:
```bash
npx spotify-mcp-playlist --client-id YOUR_CLIENT_ID --client-secret YOUR_CLIENT_SECRET --stdio
```

From source:
```bash
node build/index.js --client-id YOUR_CLIENT_ID --client-secret YOUR_CLIENT_SECRET --stdio
```

### Integrating with Cursor IDE

Add the following to your Cursor MCP configuration (`~/.cursor/mcp.json`):

```json
"Spotify Playlist": {
  "command": "npx",
  "args": [
    "spotify-mcp-playlist",
    "--client-id",
    "YOUR_CLIENT_ID",
    "--client-secret",
    "YOUR_CLIENT_SECRET",
  ]
}
```

Alternatively, if you've installed the package globally:

```json
"Spotify Playlist": {
  "command": "spotify-mcp-playlist",
  "args": [
    "--client-id",
    "YOUR_CLIENT_ID",
    "--client-secret",
    "YOUR_CLIENT_SECRET",
  ]
}
```

## Available Tools

The server provides the following MCP tools:

- `get-spotify-profile`: Get the current user's Spotify profile
- `get-spotify-playlists`: Get the current user's Spotify playlists
- `get-spotify-playlist-items`: Get items from a specific Spotify playlist
- `search-spotify`: Search for content on Spotify
- `update-spotify-playlist`: Add new tracks to a specific Spotify playlist
- `create-spotify-playlist`: Create a new Spotify playlist