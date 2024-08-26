import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { createSubject } from '../controllers/subjects/create.controller.ts'
import { createSubjectSchemas } from '../schemas/subjects/create.schemas.ts'

// biome-ignore lint/suspicious/useAwait: <explanation>
export async function subjectsRoutes(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post('/subjects', { schema: createSubjectSchemas }, createSubject)
}
