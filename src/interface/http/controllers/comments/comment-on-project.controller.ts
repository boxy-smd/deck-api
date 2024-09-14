import type { FastifyReply, FastifyRequest } from 'fastify'

import { makeCommentOnProjectUseCase } from '@/interface/factories/comments/make-comment-on-project-use-case.ts'
import type {
  CommentOnProjectBody,
  CommentOnProjectParams,
} from '../../schemas/comments/comment-on-project.schemas.ts'

export async function commentOnProject(
  request: FastifyRequest<{
    Params: CommentOnProjectParams
    Body: CommentOnProjectBody
  }>,
  reply: FastifyReply,
) {
  const { projectId } = request.params
  const { content } = request.body

  const commentOnProjectUseCase = makeCommentOnProjectUseCase()

  const result = await commentOnProjectUseCase.execute({
    projectId,
    content,
    authorId: request.user.sign.sub,
  })

  if (result.isLeft()) {
    const error = result.value
    return reply.code(error.statusCode).send(error)
  }

  reply.code(201).send({
    commentId: result.value.commentId,
  })
}
