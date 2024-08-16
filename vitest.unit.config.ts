import { configDefaults, defineConfig, mergeConfig } from 'vitest/config'

import vitestConfig from './vitest.config.js'

export default mergeConfig(
  vitestConfig,
  defineConfig({
    test: {
      include: ['src/application/use-cases/**/*.spec.ts'],
      exclude: [...configDefaults.exclude, '**/*.e2e-{test,spec}.ts'],
    },
  }),
)
