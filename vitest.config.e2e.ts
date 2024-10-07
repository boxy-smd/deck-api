import tsConfigPaths from 'vite-tsconfig-paths'
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
  plugins: [tsConfigPaths()],
})
