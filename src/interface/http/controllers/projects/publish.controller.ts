import type { FastifyReply, FastifyRequest } from 'fastify'

import { makePublishProjectUseCase } from '@/interface/factories/projects/make-publish-project-use-case'
import type { PublishProjectBody } from '../../schemas/projects/publish.schemas'

export async function publishProject(
  request: FastifyRequest<{
    Body: PublishProjectBody
  }>,
  reply: FastifyReply,
) {
  const authorId = request.user.sign.sub

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
    draftId,
  } = request.body

  const publishProjectUseCase = makePublishProjectUseCase()

  const result = await publishProjectUseCase.execute({
    title,
    description,
    bannerUrl,
    content,
    publishedYear,
    semester,
    allowComments,
    authorId,
    subjectId,
    trailsIds,
    professorsIds,
    draftId,
  })

  if (result.isLeft()) {
    const error = result.value
    return reply.status(error.statusCode).send({ message: error.message })
  }

  return reply.status(201).send({
    project_id: result.value.projectId,
  })
}
