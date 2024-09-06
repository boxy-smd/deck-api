import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { editProfile } from '../controllers/students/edit-profile.controller.ts'
import { fetchStudents } from '../controllers/students/fetch.controller.ts'
import { getProfile } from '../controllers/students/get-profile.controller.ts'
import { login } from '../controllers/students/login.controller.ts'
import { register } from '../controllers/students/register.controller.ts'
import { editProfileSchemas } from '../schemas/students/edit-profile.schemas.ts'
import { fetchStudentsSchemas } from '../schemas/students/fetch.schemas.ts'
import { getProfileSchemas } from '../schemas/students/get-profile.schemas.ts'
import { loginSchemas } from '../schemas/students/login.schemas.ts'
import { registerSchemas } from '../schemas/students/register.schemas.ts'

// biome-ignore lint/suspicious/useAwait: This function is a route handler and should not be awaited
export async function studentsRoutes(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post('/students', { schema: registerSchemas }, register)

  app
    .withTypeProvider<ZodTypeProvider>()
    .post('/sessions', { schema: loginSchemas }, login)

  app.withTypeProvider<ZodTypeProvider>().get(
    '/profile/:id',
    {
      schema: getProfileSchemas,
    },
    getProfile,
  )

  app.withTypeProvider<ZodTypeProvider>().put(
    '/profile/:id',
    {
      schema: editProfileSchemas,
    },
    editProfile,
  )

  app.withTypeProvider<ZodTypeProvider>().get(
    '/students',
    {
      schema: fetchStudentsSchemas,
    },
    fetchStudents,
  )
}
