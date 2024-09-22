import type { FastifyReply, FastifyRequest } from 'fastify'

import { makeGetDraftUseCase } from '@/interface/factories/drafts/make-get-draft-use-case.ts'
import { DraftPresenter } from '../../presenters/draft.ts'
import type { GetDraftParams } from '../../schemas/drafts/get.schemas.ts'

export async function getDraft(
  request: FastifyRequest<{
    Params: GetDraftParams
  }>,
  reply: FastifyReply,
) {
  const authorId = request.user.sign.sub

  const { draftId } = request.params

  const getDraftUseCase = makeGetDraftUseCase()

  const result = await getDraftUseCase.execute({
    draftId,
    authorId,
  })

  if (result.isLeft()) {
    const error = result.value
    return reply.status(error.statusCode).send({ message: error.message })
  }

  return reply.send({
    draft: DraftPresenter.toHTTP(result.value),
  })
}
