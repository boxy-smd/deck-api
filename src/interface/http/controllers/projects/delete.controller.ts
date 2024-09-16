import type { FastifyReply, FastifyRequest } from 'fastify'

import { makeDeleteProjectUseCase } from '@/interface/factories/projects/make-delete-project-use-case.ts'
import type { DeleteProjectParams } from '../../schemas/projects/delete.schemas.ts'

export async function deleteProject(
  request: FastifyRequest<{
    Params: DeleteProjectParams
  }>,
  reply: FastifyReply,
) {
  const studentId = request.user.sign.sub
  const { projectId } = request.params

  const deleteProjectUseCase = makeDeleteProjectUseCase()

  const result = await deleteProjectUseCase.execute({
    studentId,
    projectId,
  })

  if (result.isLeft()) {
    const error = result.value
    return reply.status(error.statusCode).send({ message: error.message })
  }

  return reply.status(204).send()
}
