import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		include: ['**/*.e2e-spec.ts'],
		globals: true,
		environmentMatchGlobs: [
			['**/*.e2e-spec.ts', 'prisma/vitest-environment-prisma'],
		],
		poolOptions: {
			threads: { execArgv: ['--env-file=.env'] },
			forks: { execArgv: ['--env-file=.env'] },
		},
	},
	resolve: {
		alias: {
			'@/@core': fileURLToPath(new URL('./src/@core', import.meta.url)),
			'@/@infra': fileURLToPath(new URL('./src/@infra', import.meta.url)),
			'@/@shared': fileURLToPath(new URL('./src/@shared', import.meta.url)),
			'@/@presentation': fileURLToPath(
				new URL('./src/@presentation', import.meta.url),
			),
			'@': fileURLToPath(new URL('./src', import.meta.url)),
			test: fileURLToPath(new URL('./test', import.meta.url)),
		},
	},
})
