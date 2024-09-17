import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { editProfile } from '../controllers/students/edit-profile.controller.ts'
import { fetchStudents } from '../controllers/students/fetch.controller.ts'
import { getProfile } from '../controllers/students/get-profile.controller.ts'
import { getStudentDetails } from '../controllers/students/get-student-details.controller.ts'
import { login } from '../controllers/students/login.controller.ts'
import { register } from '../controllers/students/register.controller.ts'
import { uploadProfileImage } from '../controllers/students/upload-profile-image.ts'
import { type ProtectedRoute, verifyJWT } from '../middlewares/verify-jwt.ts'
import { editProfileSchemas } from '../schemas/students/edit-profile.schemas.ts'
import { fetchStudentsSchemas } from '../schemas/students/fetch.schemas.ts'
import { getProfileSchemas } from '../schemas/students/get-profile.schemas.ts'
import { getStudentDetailsSchemas } from '../schemas/students/get-student-details.schemas.ts'
import { loginSchemas } from '../schemas/students/login.schemas.ts'
import { registerSchemas } from '../schemas/students/register.schemas.ts'
import { uploadProfileImageSchemas } from '../schemas/students/upload-profile-image.schemas.ts'

// biome-ignore lint/suspicious/useAwait: This function is a route handler and should not be awaited
export async function studentsRoutes(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post(
      '/profile-images/:username',
      { schema: uploadProfileImageSchemas },
      uploadProfileImage,
    )

  app
    .withTypeProvider<ZodTypeProvider>()
    .post('/students', { schema: registerSchemas }, register)

  app
    .withTypeProvider<ZodTypeProvider>()
    .post('/sessions', { schema: loginSchemas }, login)

  app.withTypeProvider<ZodTypeProvider>().get(
    '/profiles/:username',
    {
      schema: getProfileSchemas,
    },
    getProfile,
  )

  app.withTypeProvider<ZodTypeProvider>().put(
    '/profiles/:studentId',
    {
      preHandler: verifyJWT,
      schema: editProfileSchemas,
    },
    editProfile as ProtectedRoute,
  )

  app.withTypeProvider<ZodTypeProvider>().get(
    '/students',
    {
      schema: fetchStudentsSchemas,
    },
    fetchStudents,
  )

  app.get(
    '/students/details',
    {
      preHandler: verifyJWT,
      schema: getStudentDetailsSchemas,
    },
    getStudentDetails as ProtectedRoute,
  )
}
