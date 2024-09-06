import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { fetchAllProfessors } from '../controllers/professors/fetch-all.controller.ts'
import { fetchProfessorsByName } from '../controllers/professors/fetch-by-name.controller.ts'
import { fetchAllProfessorsSchemas } from '../schemas/professors/fetch-all.ts'
import { fetchProfessorsByNameSchemas } from '../schemas/professors/fetch-by-name.schemas.ts'

// biome-ignore lint/suspicious/useAwait: This function is a route handler and should not be awaited
export async function professorsRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/professors',
    {
      schema: fetchAllProfessorsSchemas,
    },
    fetchAllProfessors,
  )

  app
    .withTypeProvider<ZodTypeProvider>()
    .get(
      '/professors?name={name}',
      { schema: fetchProfessorsByNameSchemas },
      fetchProfessorsByName,
    )
}
