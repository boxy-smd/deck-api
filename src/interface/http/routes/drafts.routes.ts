import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { createDraft } from '../controllers/drafts/create.controller.ts'
import { editDraft } from '../controllers/drafts/edit.controller.ts'
import { getDraft } from '../controllers/drafts/get.controller.ts'
import { type ProtectedRoute, verifyJWT } from '../middlewares/verify-jwt.ts'
import { createDraftSchemas } from '../schemas/drafts/create.schemas.ts'
import { editDraftSchemas } from '../schemas/drafts/edit.schemas.ts'
import { getDraftSchemas } from '../schemas/drafts/get.schemas.ts'

// biome-ignore lint/suspicious/useAwait: This function is a route handler and should not be awaited
export async function draftsRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/drafts/:draftId',
    {
      preHandler: verifyJWT,
      schema: getDraftSchemas,
    },
    getDraft as ProtectedRoute,
  )

  app.withTypeProvider<ZodTypeProvider>().post(
    '/drafts',
    {
      preHandler: verifyJWT,
      schema: createDraftSchemas,
    },
    createDraft as ProtectedRoute,
  )

  app.withTypeProvider<ZodTypeProvider>().put(
    '/drafts/:draftId',
    {
      preHandler: verifyJWT,
      schema: editDraftSchemas,
    },
    editDraft as ProtectedRoute,
  )
}
