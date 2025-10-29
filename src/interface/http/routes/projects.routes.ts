import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { deleteProject } from '../controllers/projects/delete.controller'
import { fetchPosts } from '../controllers/projects/fetch-posts.controller'
import { filterPosts } from '../controllers/projects/filter-posts.controller'
import { getProject } from '../controllers/projects/get.controller'
import { publishProject } from '../controllers/projects/publish.controller'
import { searchPosts } from '../controllers/projects/search-posts.controller'
import { uploadBanner } from '../controllers/projects/upload-banner'
import { type ProtectedRoute, verifyJWT } from '../middlewares/verify-jwt'
import { deleteProjectSchemas } from '../schemas/projects/delete.schemas'
import { fetchPostsSchemas } from '../schemas/projects/fetch-posts'
import { filterPostsSchemas } from '../schemas/projects/filter-posts.schemas'
import { getProjectSchemas } from '../schemas/projects/get.schemas'
import { publishProjectSchemas } from '../schemas/projects/publish.schemas'
import { searchPostsSchemas } from '../schemas/projects/search-posts.schemas'
import { uploadBannerSchemas } from '../schemas/projects/upload-banner.schemas'

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
