import type { GetSubjectByIdUseCaseResponse } from '@/application/dtos/subjects/get-by-id-dtos.ts'
import type { SubjectsRepository } from '@/application/repositories/subjects-repository.ts'
import { left, right } from '@/domain/core/logic/either.ts'
import { SubjectNotFoundError } from './errors/subject-not-found.error.ts'

export class GetSubjectByIdUseCase {
  constructor(private subjectsRepository: SubjectsRepository) {}

  async execute(id: string): Promise<GetSubjectByIdUseCaseResponse> {
    const subject = await this.subjectsRepository.findById(id)
    const isSubjectNotFound = !subject

    if (isSubjectNotFound) {
      return left(new SubjectNotFoundError())
    }

    return right(subject)
  }
}
