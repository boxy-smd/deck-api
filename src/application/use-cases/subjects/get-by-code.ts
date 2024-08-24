import type { GetSubjectByCodeResponse } from '@/application/dtos/subjects/get-by-code-dtos.ts'
import type { SubjectsRepository } from '@/application/repositories/subjects-repository.ts'
import { left, right } from '@/domain/core/logic/either.ts'
import { SubjectNotFoundError } from './errors/subject-not-found.error.ts'

export class GetSubjectByCodeUseCase {
  constructor(private subjectsRepository: SubjectsRepository) {}

  async execute(code: string): Promise<GetSubjectByCodeResponse> {
    const subject = await this.subjectsRepository.findByCode(code)
    const isSubjectNotFound = !subject

    if (isSubjectNotFound) {
      return left(new SubjectNotFoundError())
    }

    return right(subject)
  }
}
