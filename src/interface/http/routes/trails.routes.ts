import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { fetchAllTrails } from '../controllers/trails/fetch-all.controller.ts'
import { fetchAllTrailsSchemas } from '../schemas/trails/fetch-all.schemas.ts'

// biome-ignore lint/suspicious/useAwait: This function is a route handler and should not be awaited
export async function trailsRoutes(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/trails', { schema: fetchAllTrailsSchemas }, fetchAllTrails)
}
