import { type Either, left, right } from '@/core/either.ts'
import type { Project } from '@/domain/entities/project.entity.ts'
import type { ProjectsRepository } from '@/domain/repositories/projects-repository.ts'
import { ProjectNotFoundError } from './errors/project-not-found.ts'

interface FindProjectByIdUseCaseRequest {
  id: string
}

type FindProjectByIdUseCaseResponse = Either<ProjectNotFoundError, Project>

export class FindProjectByIdUseCase {
  constructor(private projectsRepository: ProjectsRepository) {}

  async execute({
    id,
  }: FindProjectByIdUseCaseRequest): Promise<FindProjectByIdUseCaseResponse> {
    const projectExists = await this.projectsRepository.findById(id)

    if (!projectExists) {
      return left(new ProjectNotFoundError())
    }

    const project = projectExists

    return right(project)
  }
}
