import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { fetchProfessorsByName } from '../controllers/professors/fetch-by-name.controller.ts'
import { fetchProfessorsByNameSchemas } from '../schemas/professors/fetch-by-name.schemas.ts'

// biome-ignore lint/suspicious/useAwait: This function is a route handler and should not be awaited
export async function professorsRoutes(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get(
      '/professors',
      { schema: fetchProfessorsByNameSchemas },
      fetchProfessorsByName,
    )
}
