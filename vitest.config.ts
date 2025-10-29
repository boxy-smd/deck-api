import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    root: './',
  },
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
      'test': new URL('./test', import.meta.url).pathname,
    },
  },
})
