import { makeEditProjectUseCase } from '@/interface/factories/projects/make-edit-project-use-case.ts'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { ProjectPresenter } from '../../presenters/project.ts'
import type {
  EditProjectBody,
  EditProjectParams,
} from '../../schemas/projects/edit.schemas.ts'

export async function editProject(
  request: FastifyRequest<{
    Params: EditProjectParams
    Body: EditProjectBody
  }>,
  reply: FastifyReply,
) {
  const { projectId } = request.params
  const {
    authorId,
    title,
    description,
    bannerUrl,
    content,
    publishedYear,
    status,
    semester,
    allowComments,
    subjectId,
    trailsIds,
    professorsIds,
  } = request.body

  const editProjectUseCase = makeEditProjectUseCase()

  const result = await editProjectUseCase.execute({
    projectId,
    title,
    description,
    bannerUrl,
    content,
    publishedYear,
    status,
    semester,
    allowComments,
    subjectId,
    trailsIds,
    professorsIds,
    authorId,
  })

  if (result.isLeft()) {
    const error = result.value
    return reply.status(error.statusCode).send({ message: error.message })
  }

  return reply.status(200).send({
    project: ProjectPresenter.toHTTP(result.value),
  })
}
