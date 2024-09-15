import { makeReportCommentUseCase } from '@/interface/factories/comments/make-report-comment-use-case.ts'
import type { FastifyReply, FastifyRequest } from 'fastify'
import type {
  ReporCommentBody,
  ReporCommentParams,
} from '../../schemas/comments/report.schemas.ts'

export async function reportComment(
  request: FastifyRequest<{
    Params: ReporCommentParams
    Body: ReporCommentBody
  }>,
  reply: FastifyReply,
): Promise<void> {
  const { commentId } = request.params
  const { content } = request.body

  const authorId = request.user.sign.sub

  const reportCommentUseCase = makeReportCommentUseCase()

  const result = await reportCommentUseCase.execute({
    authorId,
    commentId,
    content,
  })

  if (result.isLeft()) {
    const error = result.value
    return reply.status(error.statusCode).send(error.message)
  }

  return reply.status(201).send({
    message: 'Comment reported successfully.',
  })
}
