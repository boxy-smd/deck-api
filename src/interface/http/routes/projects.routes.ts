import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { commentOnProject } from '../controllers/comments/comment-on-project.controller.ts'
import { deleteProject } from '../controllers/projects/delete.controller.ts'
import { editProject } from '../controllers/projects/edit.controller.ts'
import { fetchPosts } from '../controllers/projects/fetch-posts.controller.ts'
import { getProject } from '../controllers/projects/get.controller.ts'
import { publishProject } from '../controllers/projects/publish.controller.ts'
import { commentOnProjectSchemas } from '../schemas/comments/comment-on-project.schemas.ts'
import { deleteProjectSchemas } from '../schemas/projects/delete.schemas.ts'
import { editProjectSchemas } from '../schemas/projects/edit.schemas.ts'
import { fetchPostsSchemas } from '../schemas/projects/fetch-posts.ts'
import { getProjectSchemas } from '../schemas/projects/get.schemas.ts'
import { publishProjectSchemas } from '../schemas/projects/publish.schemas.ts'

// biome-ignore lint/suspicious/useAwait: This function is a route handler and should not be awaited
export async function projectsRoutes(app: FastifyInstance) {
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

  app
    .withTypeProvider<ZodTypeProvider>()
    .post('/projects', { schema: publishProjectSchemas }, publishProject)

  app
    .withTypeProvider<ZodTypeProvider>()
    .post(
      '/projects/:projectId/comments',
      { schema: commentOnProjectSchemas },
      commentOnProject,
    )

  app
    .withTypeProvider<ZodTypeProvider>()
    .put('/projects/:projectId', { schema: editProjectSchemas }, editProject)

  app
    .withTypeProvider<ZodTypeProvider>()
    .delete(
      '/projects/:projectId',
      { schema: deleteProjectSchemas },
      deleteProject,
    )
}
