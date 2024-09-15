import { makeDeleteCommentUseCase } from '@/interface/factories/comments/make-delete-comment-use-case.ts'
import type { FastifyReply, FastifyRequest } from 'fastify'
import type { DeleteCommentParams } from '../../schemas/comments/delete.schemas.ts'

export async function deleteComment(
  request: FastifyRequest<{
    Params: DeleteCommentParams
  }>,
  reply: FastifyReply,
) {
  const authorId = request.user.sign.sub
  const { commentId, projectId } = request.params

  const deleteCommentUseCase = makeDeleteCommentUseCase()

  console.log(authorId, commentId, projectId)

  const result = await deleteCommentUseCase.execute({
    authorId,
    commentId,
    projectId,
  })

  if (result.isLeft()) {
    const error = result.value
    return reply.status(error.statusCode).send({ message: error.message })
  }

  return reply.status(204).send()
}
