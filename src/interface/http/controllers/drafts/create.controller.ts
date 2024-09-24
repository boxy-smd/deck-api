import type { FastifyReply, FastifyRequest } from 'fastify'

import { makeCreateDraftUseCase } from '@/interface/factories/drafts/make-create-draft-use-case.ts'
import type { CreateDraftBody } from '../../schemas/drafts/create.schemas.ts'

export async function createDraft(
  request: FastifyRequest<{
    Body: CreateDraftBody
  }>,
  reply: FastifyReply,
) {
  const authorId = request.user.sign.sub

  const {
    title,
    content,
    description,
    allowComments,
    subjectId,
    trailsIds,
    professorsIds,
    bannerUrl,
    publishedYear,
    semester,
  } = request.body

  const createDraftUseCase = makeCreateDraftUseCase()

  const result = await createDraftUseCase.execute({
    title,
    content,
    description,
    allowComments,
    subjectId,
    trailsIds,
    professorsIds,
    bannerUrl,
    publishedYear,
    semester,
    authorId,
  })

  if (result.isLeft()) {
    const error = result.value
    return reply.status(error.statusCode).send({ message: error.message })
  }

  return reply.code(201).send({
    draft_id: result.value.draftId,
  })
}
