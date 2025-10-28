import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/server.ts'],
  format: ['esm'],
  outDir: 'build',
  clean: true,
  sourcemap: false,
  minify: false,
  external: [
    '@prisma/client',
    '.prisma/client',
  ],
  noExternal: [],
  bundle: false,
  splitting: false,
})
