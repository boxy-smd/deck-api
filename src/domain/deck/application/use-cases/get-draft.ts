import { type Either, left, right } from '@/core/either.ts'
import { ForbiddenError } from '@/core/errors/forbidden.error.ts'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error.ts'
import type { Draft } from '../../enterprise/entities/draft.ts'
import type { DraftsRepository } from '../repositories/drafts-repository.ts'
import type { StudentsRepository } from '../repositories/students-repository.ts'

interface GetDraftUseCaseRequest {
  draftId: string
  authorId: string
}

type GetDraftUseCaseResponse = Either<
  ResourceNotFoundError | ForbiddenError,
  Draft
>

export class GetDraftUseCase {
  constructor(
    private draftsRepository: DraftsRepository,
    private studentsRepository: StudentsRepository,
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

    const draft = await this.draftsRepository.findById(draftId)

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
