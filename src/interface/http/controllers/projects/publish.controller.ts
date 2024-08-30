import { makePublishProjectUseCase } from '@/interface/factories/projects/make-publish-project-use-case.ts'
import type { FastifyReply, FastifyRequest } from 'fastify'
import type { PublishProjectParamsSchema } from '../../schemas/projects/publish.schemas.ts'

export async function publishProject(
  request: FastifyRequest<{
    Params: PublishProjectParamsSchema
  }>,
  reply: FastifyReply,
) {
  const {
    title,
    description,
    bannerUrl,
    content,
    publishedYear,
    status,
    semester,
    allowComments,
    authorId,
    subjectId,
    trailsIds,
    professorsIds,
  } = request.params

  const publishProjectUseCase = makePublishProjectUseCase()

  const result = await publishProjectUseCase.execute({
    title,
    description,
    bannerUrl,
    content,
    publishedYear,
    status,
    semester,
    allowComments,
    authorId,
    subjectId,
    trailsIds,
    professorsIds,
  })

  if (result.isLeft()) {
    const error = result.value
    return reply.status(error.statusCode).send({ message: error.message })
  }

  return reply.status(200).send({ message: 'Project published successfully.' })
}
