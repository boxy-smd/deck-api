import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**/*.e2e-spec.ts'],
    globals: true,
    environmentMatchGlobs: [['src/**', 'prisma/vitest-environment-prisma']],
    poolOptions: {
      threads: { execArgv: ['--env-file=.env'] },
      forks: { execArgv: ['--env-file=.env'] },
    },
  },
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
      'test': new URL('./test', import.meta.url).pathname,
    },
  },
})
