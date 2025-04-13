import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import type { AccessToken } from '@spotify/web-api-ts-sdk';
import open from 'open';
import crypto from 'crypto';
import os from 'os';

// Define Zod schema that matches Spotify's AccessToken type
const spotifyTokenSchema = z.object({
    access_token: z.string(),
    token_type: z.string(),
    expires_in: z.number(),
    refresh_token: z.string(),
    scope: z.string(),
}) satisfies z.ZodType<AccessToken>;

// Parse command line arguments
const args = process.argv.slice(2);
let client_id: string | undefined;
let client_secret: string | undefined;

for (let i = 0; i < args.length; i++) {
    if (args[i] === '--client-id' && i + 1 < args.length) {
        client_id = args[i + 1];
    }
    if (args[i] === '--client-secret' && i + 1 < args.length) {
        client_secret = args[i + 1];
    }
}

if (!client_id || !client_secret) {
    console.error("Missing --client-id or --client-secret arguments");
    process.exit(1);
}

const app = express();
const redirect_uri = 'http://127.0.0.1:8888/callback';
const state = crypto.randomBytes(16).toString('hex');

app.use(cors())
   .use(cookieParser());

app.get('/login', (req: Request, res: Response) => {
    const scope = [
        "user-read-private",
        "user-read-email",
        "playlist-read-private",
        "playlist-modify-public",
        "playlist-modify-private",
    ].join(' ');

    // Store state in cookie for verification
    res.cookie('spotify_auth_state', state);

    res.redirect('https://accounts.spotify.com/authorize?' +
        new URLSearchParams({
            response_type: 'code',
            client_id: client_id!,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state,
        }).toString()
    );
});

app.get('/callback', async (req: Request, res: Response) => {
    const code = req.query.code || null;
    const receivedState = req.query.state || null;
    const storedState = req.cookies?.spotify_auth_state;

    // Verify state matches to prevent CSRF attacks
    if (!receivedState || receivedState !== storedState) {
        res.status(400).send('State verification failed. Authorization rejected.');
        return;
    }
    
    if (code) {
        try {
            const response = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
                },
                body: new URLSearchParams({
                    code: code.toString(),
                    redirect_uri: redirect_uri,
                    grant_type: 'authorization_code'
                }).toString()
            });

            if (!response.ok) {
                throw new Error(`Failed to get access token: ${response.statusText}`);
            }

            const data = await response.json();
            const validatedToken = spotifyTokenSchema.parse(data);
            
            const credentialsPath = path.join(os.homedir(), '.spotify-mcp-credentials.json');
            fs.writeFileSync(
                credentialsPath,
                JSON.stringify(validatedToken, null, 2)
            );
            
            res.send('Authorization successful! You can close this window and start the MCP.');
            process.exit(0);
        } catch (error) {
            console.error('Error during authorization:', error);
            if (error instanceof z.ZodError) {
                res.status(500).send(`Invalid token format received from Spotify: ${error.errors.map(e => e.message).join(', ')}`);
            } else {
                res.status(500).send(`Authorization failed: ${error instanceof Error ? error.message : String(error)}`);
            }
        }
    } else {
        res.status(400).send('No authorization code provided');
    }
});

app.listen(8888, async () => {
    console.log('Auth server listening on 8888');
    console.log('Opening browser for Spotify authentication...');
    await open('http://127.0.0.1:8888/login');
});