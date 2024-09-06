import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { fetchAllSubjects } from '../controllers/subjects/fetch-all.controller.ts'
import { fetchSubjectsByName } from '../controllers/subjects/fetch-by-name.controller.ts'
import { fetchAllSubjectsSchemas } from '../schemas/subjects/fetch-all.schemas.ts'
import { fetchSubjectsByNameSchemas } from '../schemas/subjects/fetch-by-name.schemas.ts'

// biome-ignore lint/suspicious/useAwait: This function is a route handler and should not be awaited
export async function subjectsRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/subjects',
    {
      schema: fetchAllSubjectsSchemas,
    },
    fetchAllSubjects,
  )

  app
    .withTypeProvider<ZodTypeProvider>()
    .get(
      '/subjects?name={name}',
      { schema: fetchSubjectsByNameSchemas },
      fetchSubjectsByName,
    )
}
