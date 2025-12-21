import { Project } from '@/@core/domain/projects/entities/project'
import { Either, right } from '@/@shared/kernel/either'
import { Injectable } from '@nestjs/common'
import { ProjectsRepository } from '../repositories/projects-repository'

interface ListDraftsUseCaseRequest {
  authorId: string
}

type ListDraftsUseCaseResponse = Either<
  null,
  {
    drafts: Project[]
  }
>

@Injectable()
export class ListDraftsUseCase {
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  async execute({
    authorId,
  }: ListDraftsUseCaseRequest): Promise<ListDraftsUseCaseResponse> {
    const drafts = await this.projectsRepository.findDraftsByAuthorId(authorId)

    return right({
      drafts,
    })
  }
}
