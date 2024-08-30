import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { fetchSubjectsByName } from '../controllers/subjects/fetch-by-name.controller.ts'
import { fetchSubjectsByNameSchemas } from '../schemas/subjects/fetch-by-name.schemas.ts'

// biome-ignore lint/suspicious/useAwait: This function is a route handler and should not be awaited
export async function subjectsRoutes(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get(
      '/subjects',
      { schema: fetchSubjectsByNameSchemas },
      fetchSubjectsByName,
    )
}
