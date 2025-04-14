import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/bin-auth.ts'],
  format: ['esm'],
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: true,
  outDir: 'dist',
  shims: true,
  target: 'node18',
  external: [
    '@modelcontextprotocol/sdk',
    '@spotify/web-api-ts-sdk'
  ]
}); 