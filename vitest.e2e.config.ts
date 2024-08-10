import { defineConfig, mergeConfig } from 'vitest/config'

import vitestConfig from './vitest.config.ts'

export default mergeConfig(
  vitestConfig,
  defineConfig({
    test: {
      include: ['src/interface/http/controllers/**/*.e2e-spec.ts'],
      environmentMatchGlobs: [['src/**', 'prisma/vitest-environment-prisma']],
      poolOptions: {
        threads: { execArgv: ['--env-file=.env'] },
        forks: { execArgv: ['--env-file=.env'] },
      },
    },
  }),
)
