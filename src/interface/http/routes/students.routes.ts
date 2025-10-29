import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { editProfile } from '../controllers/students/edit-profile.controller'
import { fetchStudents } from '../controllers/students/fetch.controller'
import { getProfile } from '../controllers/students/get-profile.controller'
import { getStudentDetails } from '../controllers/students/get-student-details.controller'
import { login } from '../controllers/students/login.controller'
import { refresh } from '../controllers/students/refresh.controller'
import { register } from '../controllers/students/register.controller'
import { uploadProfileImage } from '../controllers/students/upload-profile-image'
import { type ProtectedRoute, verifyJWT } from '../middlewares/verify-jwt'
import { editProfileSchemas } from '../schemas/students/edit-profile.schemas'
import { fetchStudentsSchemas } from '../schemas/students/fetch.schemas'
import { getProfileSchemas } from '../schemas/students/get-profile.schemas'
import { getStudentDetailsSchemas } from '../schemas/students/get-student-details.schemas'
import { loginSchemas } from '../schemas/students/login.schemas'
import { refreshSchemas } from '../schemas/students/refresh.schemas'
import { registerSchemas } from '../schemas/students/register.schemas'
import { uploadProfileImageSchemas } from '../schemas/students/upload-profile-image.schemas'

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

  app
    .withTypeProvider<ZodTypeProvider>()
    .patch('/token/refresh', { schema: refreshSchemas }, refresh)

  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/profiles/:username', { schema: getProfileSchemas }, getProfile)

  app.withTypeProvider<ZodTypeProvider>().put(
    '/profiles/:studentId',
    {
      preHandler: verifyJWT,
      schema: editProfileSchemas,
    },
    editProfile as ProtectedRoute,
  )

  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/students', { schema: fetchStudentsSchemas }, fetchStudents)

  app.withTypeProvider<ZodTypeProvider>().get(
    '/students/me',
    {
      preHandler: verifyJWT,
      schema: getStudentDetailsSchemas,
    },
    getStudentDetails as ProtectedRoute,
  )
}
