import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { fetchProfessors } from '../controllers/professors/fetch.controller.ts'
import { fetchProfessorsSchemas } from '../schemas/professors/fetch.schemas.ts'

// biome-ignore lint/suspicious/useAwait: This function is a route handler and should not be awaited
export async function professorsRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/professors',
    {
      schema: fetchProfessorsSchemas,
    },
    fetchProfessors,
  )
}
