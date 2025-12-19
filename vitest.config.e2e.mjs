import swc from 'unplugin-swc'
import tsConfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**/*.e2e-spec.ts'],
    globals: true,
    root: './',
    setupFiles: ['./test/e2e/setup-e2e.ts'],
    fileParallelism: false, // Roda arquivos sequencialmente
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
  },
  plugins: [
    tsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
  resolve: {
    alias: {
      '@/@core': './src/@core',
      '@/@infra': './src/@infra',
      '@/@shared': './src/@shared',
      '@/@presentation': './src/@presentation',
      '@': './src',
      test: './test',
    },
  },
})
