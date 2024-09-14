import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { deleteProject } from '../controllers/projects/delete.controller.ts'
import { editProject } from '../controllers/projects/edit.controller.ts'
import { fetchPosts } from '../controllers/projects/fetch-posts.controller.ts'
import { getProject } from '../controllers/projects/get.controller.ts'
import { publishProject } from '../controllers/projects/publish.controller.ts'
import { uploadBanner } from '../controllers/projects/upload-banner.ts'
import { type ProtectedRoute, verifyJWT } from '../middlewares/verify-jwt.ts'
import { deleteProjectSchemas } from '../schemas/projects/delete.schemas.ts'
import { editProjectSchemas } from '../schemas/projects/edit.schemas.ts'
import { fetchPostsSchemas } from '../schemas/projects/fetch-posts.ts'
import { getProjectSchemas } from '../schemas/projects/get.schemas.ts'
import { publishProjectSchemas } from '../schemas/projects/publish.schemas.ts'
import { uploadBannerSchemas } from '../schemas/projects/upload-banner.schemas.ts'

// biome-ignore lint/suspicious/useAwait: This function is a route handler and should not be awaited
export async function projectsRoutes(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post(
      '/banners/:projectId',
      { preHandler: verifyJWT, schema: uploadBannerSchemas },
      uploadBanner as ProtectedRoute,
    )

  app.withTypeProvider<ZodTypeProvider>().get(
    '/projects',
    {
      schema: fetchPostsSchemas,
    },
    fetchPosts,
  )

  app.withTypeProvider<ZodTypeProvider>().get(
    '/projects/:projectId',
    {
      schema: getProjectSchemas,
    },
    getProject,
  )

  app.withTypeProvider<ZodTypeProvider>().post(
    '/projects',
    {
      preHandler: verifyJWT,
      schema: publishProjectSchemas,
    },
    publishProject as ProtectedRoute,
  )

  app.withTypeProvider<ZodTypeProvider>().put(
    '/projects/:projectId',
    {
      preHandler: verifyJWT,
      schema: editProjectSchemas,
    },
    editProject as ProtectedRoute,
  )

  app.withTypeProvider<ZodTypeProvider>().delete(
    '/projects/:projectId',
    {
      preHandler: verifyJWT,
      schema: deleteProjectSchemas,
    },
    deleteProject as ProtectedRoute,
  )
}
