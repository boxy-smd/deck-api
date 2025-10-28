import type { UsersRepository } from '@/domain/authentication/application/repositories/users-repository.ts'
import type { ProjectsRepository } from '@/domain/projects/application/repositories/projects-repository.ts'
import type { Project } from '@/domain/projects/enterprise/entities/project.ts'
import { type Either, left, right } from '@/shared/either.ts'
import { ForbiddenError } from '@/shared/errors/forbidden.error.ts'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found.error.ts'

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
