import type { FastifyReply, FastifyRequest } from 'fastify'

import { makeEditDraftUseCase } from '@/interface/factories/drafts/make-edit-project-use-case.ts'
import type {
  EditDraftBody,
  EditDraftParams,
} from '../../schemas/drafts/edit.schemas.ts'

export async function editDraft(
  request: FastifyRequest<{
    Params: EditDraftParams
    Body: EditDraftBody
  }>,
  reply: FastifyReply,
) {
  const authorId = request.user.sign.sub

  const { draftId } = request.params
  const {
    title,
    description,
    bannerUrl,
    content,
    publishedYear,
    semester,
    allowComments,
    subjectId,
    trailsIds,
    professorsIds,
  } = request.body

  const editDraftUseCase = makeEditDraftUseCase()

  const result = await editDraftUseCase.execute({
    authorId,
    draftId,
    title,
    description,
    bannerUrl,
    content,
    publishedYear,
    semester,
    allowComments,
    subjectId,
    trailsIds,
    professorsIds,
  })

  if (result.isLeft()) {
    const error = result.value
    return reply.status(error.statusCode).send({ message: error.message })
  }

  return reply.status(200).send({
    message: 'Draft updated successfully.',
  })
}
