import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { login } from '../controllers/users/login.controller.ts'
import { register } from '../controllers/users/register.controller.ts'
import { loginSchemas } from '../schemas/users/login.schemas.ts'
import { registerSchemas } from '../schemas/users/register.schemas.ts'

// biome-ignore lint/suspicious/useAwait: <explanation>
export async function usersRoutes(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post('/users', { schema: registerSchemas }, register)

  app
    .withTypeProvider<ZodTypeProvider>()
    .post('/sessions', { schema: loginSchemas }, login)
}
