import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  {
    extends: 'vitest.config.mjs',
    test: {
      name: 'unit',
    }
  },
  {
    extends: 'vitest.config.integration.mjs',
    test: {
      name: 'integration',
    }
  },
  {
    extends: 'vitest.config.e2e.mjs',
    test: {
      name: 'e2e',
    }
  }
])
