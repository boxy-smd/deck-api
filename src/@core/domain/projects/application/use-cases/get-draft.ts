import type { UsersRepository } from '@/@core/domain/authentication/application/repositories/users-repository'
import type { ProjectsRepository } from '@/@core/domain/projects/application/repositories/projects-repository'
import type { Project } from '@/@core/domain/projects/enterprise/entities/project'
import { type Either, left, right } from '@/@shared/kernel/either'
import { ForbiddenError } from '@/@shared/kernel/errors/forbidden.error'
import { ResourceNotFoundError } from '@/@shared/kernel/errors/resource-not-found.error'

interface GetDraftUseCaseRequest {
  draftId: string
  authorId: string
}

type GetDraftUseCaseResponse = Either<
  ResourceNotFoundError | ForbiddenError,
  Project
>

export class GetDraftUseCase {
  constructor(
    private projectsRepository: ProjectsRepository,
    private studentsRepository: UsersRepository,
  ) {}

  async execute({
    draftId,
    authorId,
  }: GetDraftUseCaseRequest): Promise<GetDraftUseCaseResponse> {
    if (!authorId) {
      return left(
        new ForbiddenError('You are not allowed to access this resource.'),
      )
    }

    const student = await this.studentsRepository.findById(authorId)

    if (!student) {
      return left(new ResourceNotFoundError('Student not found.'))
    }

    const draft = await this.projectsRepository.findById(draftId)

    if (!draft) {
      return left(new ResourceNotFoundError('Draft not found.'))
    }

    if (draft.authorId.toString() !== authorId) {
      return left(
        new ForbiddenError('You are not allowed to access this resource.'),
      )
    }

    return right(draft)
  }
}
