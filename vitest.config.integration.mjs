import { config } from 'dotenv'
import swc from 'unplugin-swc'
import tsConfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

// Carrega variáveis de ambiente do .env
config()

export default defineConfig({
  test: {
    include: ['**/*.integration.spec.ts'],
    globals: true,
    root: './',
    setupFiles: ['./test/integration/setup-integration.ts'],
    fileParallelism: false,
    pool: 'threads',
    maxWorkers: 1,
    isolate: false,
    testTimeout: 30000,
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
