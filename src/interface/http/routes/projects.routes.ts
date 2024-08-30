import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { publishProject } from '../controllers/projects/publish.controller.ts'
import { publishProjectSchemas } from '../schemas/projects/publish.schemas.ts'

// biome-ignore lint/suspicious/useAwait: This function is a route handler and should not be awaited
export async function projectsRoutes(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post('/projects', { schema: publishProjectSchemas }, publishProject)
}
