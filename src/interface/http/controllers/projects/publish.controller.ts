import type { FastifyReply, FastifyRequest } from 'fastify'

import { makePublishProjectUseCase } from '@/interface/factories/projects/make-publish-project-use-case.ts'
import type { PublishProjectBody } from '../../schemas/projects/publish.schemas.ts'

export async function publishProject(
  request: FastifyRequest<{
    Body: PublishProjectBody
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
  } = request.body

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

  return reply.status(201).send({ message: 'Project published successfully.' })
}
