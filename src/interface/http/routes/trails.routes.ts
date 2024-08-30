import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { fetchTrails } from '../controllers/trails/fetch.ts'
import { fetchTrailsSchemas } from '../schemas/trails/fetch.schemas.ts'

// biome-ignore lint/suspicious/useAwait: This function is a route handler and should not be awaited
export async function trailsRoutes(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/trails', { schema: fetchTrailsSchemas }, fetchTrails)
}
