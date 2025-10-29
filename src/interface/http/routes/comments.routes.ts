import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { commentOnProject } from '../controllers/comments/comment-on-project.controller'
import { deleteComment } from '../controllers/comments/delete.controller'
import { reportComment } from '../controllers/comments/report.controller'
import { type ProtectedRoute, verifyJWT } from '../middlewares/verify-jwt'
import { commentOnProjectSchemas } from '../schemas/comments/comment-on-project.schemas'
import { deleteCommentSchemas } from '../schemas/comments/delete.schemas'
import { reportCommentSchemas } from '../schemas/comments/report.schemas'

// biome-ignore lint/suspicious/useAwait: This function is a route handler and should not be awaited
export async function commentsRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/projects/:projectId/comments',
    {
      preHandler: verifyJWT,
      schema: commentOnProjectSchemas,
    },
    commentOnProject as ProtectedRoute,
  )

  app.withTypeProvider<ZodTypeProvider>().post(
    '/reports/:commentId',
    {
      preHandler: verifyJWT,
      schema: reportCommentSchemas,
    },
    reportComment as ProtectedRoute,
  )

  app.withTypeProvider<ZodTypeProvider>().delete(
    '/projects/:projectId/comments/:commentId',
    {
      preHandler: verifyJWT,
      schema: deleteCommentSchemas,
    },
    deleteComment as ProtectedRoute,
  )
}
