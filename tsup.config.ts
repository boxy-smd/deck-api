import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/server.ts'],
  format: ['esm'],
  outDir: 'build',
  clean: true,
  sourcemap: false,
  minify: false,
  bundle: true,
  external: ['@prisma/client', '.prisma'],
})
