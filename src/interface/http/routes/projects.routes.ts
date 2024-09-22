import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { deleteProject } from '../controllers/projects/delete.controller.ts'
import { fetchPosts } from '../controllers/projects/fetch-posts.controller.ts'
import { filterPosts } from '../controllers/projects/filter-posts.controller.ts'
import { getProject } from '../controllers/projects/get.controller.ts'
import { publishProject } from '../controllers/projects/publish.controller.ts'
import { searchPosts } from '../controllers/projects/search-posts.controller.ts'
import { uploadBanner } from '../controllers/projects/upload-banner.ts'
import { type ProtectedRoute, verifyJWT } from '../middlewares/verify-jwt.ts'
import { deleteProjectSchemas } from '../schemas/projects/delete.schemas.ts'
import { fetchPostsSchemas } from '../schemas/projects/fetch-posts.ts'
import { filterPostsSchemas } from '../schemas/projects/filter-posts.schemas.ts'
import { getProjectSchemas } from '../schemas/projects/get.schemas.ts'
import { publishProjectSchemas } from '../schemas/projects/publish.schemas.ts'
import { searchPostsSchemas } from '../schemas/projects/search-posts.schemas.ts'
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
    '/projects/search',
    {
      schema: searchPostsSchemas,
    },
    searchPosts,
  )

  app.withTypeProvider<ZodTypeProvider>().get(
    '/projects/filter',
    {
      schema: filterPostsSchemas,
    },
    filterPosts,
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

  app.withTypeProvider<ZodTypeProvider>().delete(
    '/projects/:projectId',
    {
      preHandler: verifyJWT,
      schema: deleteProjectSchemas,
    },
    deleteProject as ProtectedRoute,
  )
}
