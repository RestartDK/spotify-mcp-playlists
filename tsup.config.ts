import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'esnext',
  outDir: 'dist',
  outExtension: ({ format }) => ({
    js: '.js',
  }),

  clean: true,
  dts: true,
  shims: true,
  noExternal: ['@modelcontextprotocol/sdk', '@spotify/web-api-ts-sdk'],
  minify: true
}); 