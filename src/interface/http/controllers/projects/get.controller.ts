import type { FastifyReply, FastifyRequest } from 'fastify'

import { makeGetProjectUseCase } from '@/interface/factories/projects/make-get-project-use-case.ts'
import { ProjectDetailsPresenter } from '../../presenters/project-details.ts'
import type { GetProjectParams } from '../../schemas/projects/get.schemas.ts'

export async function getProject(
  request: FastifyRequest<{
    Params: GetProjectParams
  }>,
  reply: FastifyReply,
) {
  const { projectId } = request.params

  const getProjectUseCase = makeGetProjectUseCase()

  const result = await getProjectUseCase.execute({
    projectId,
  })

  if (result.isLeft()) {
    const error = result.value
    return reply.status(error.statusCode).send({ message: error.message })
  }

  return reply.status(200).send({
    project: ProjectDetailsPresenter.toHTTP(result.value),
  })
}
