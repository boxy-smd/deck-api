import { type Either, left, right } from '@/core/either.ts'
import { ForbiddenError } from '@/core/errors/forbidden.error.ts'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error.ts'
import type { ProjectsRepository } from '../repositories/projects-repository.ts'

interface DeleteProjectUseCaseRequest {
  studentId: string
  projectId: string
}

type DeleteProjectUseCaseResponse = Either<
  ForbiddenError | ResourceNotFoundError,
  void
>

export class DeleteProjectUseCase {
  constructor(private projectRepository: ProjectsRepository) {}

  async execute({
    studentId,
    projectId,
  }: DeleteProjectUseCaseRequest): Promise<DeleteProjectUseCaseResponse> {
    const project = await this.projectRepository.findById(projectId)

    if (!project) {
      return left(new ResourceNotFoundError('Project not found.'))
    }

    if (project.authorId.toString() !== studentId) {
      return left(
        new ForbiddenError('You are not allowed to delete this project.'),
      )
    }

    await this.projectRepository.delete(projectId)

    return right(undefined)
  }
}
