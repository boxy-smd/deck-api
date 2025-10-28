import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/server.ts'],
  format: ['esm'],
  outDir: 'build',
  clean: true,
  sourcemap: false,
  minify: false,
  external: [
    'test',
    '@vitest',
    'vitest',
    'supertest',
  ],
  noExternal: [
    '@prisma/client',
  ],
  skipNodeModulesBundle: true,
})
