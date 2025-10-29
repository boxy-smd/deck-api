import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { fetchSubjects } from '../controllers/subjects/fetch.controller'
import { fetchSubjectsSchemas } from '../schemas/subjects/fetch.schemas'

// biome-ignore lint/suspicious/useAwait: This function is a route handler and should not be awaited
export async function subjectsRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/subjects',
    {
      schema: fetchSubjectsSchemas,
    },
    fetchSubjects,
  )
}
