import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/bin-auth.ts'],
  format: ['esm'],
  target: 'esnext',
  outDir: 'dist',
  outExtension: ({ format }) => ({
    js: '.js',
  }),

  clean: true,
  dts: true,
  shims: true,
  noExternal: ['@modelcontextprotocol/sdk'],
  minify: true
}); 