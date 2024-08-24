import type { FetchSubjectsByCodeUseCaseResponse } from '@/application/dtos/subjects/fetch-by-code-dtos.ts'
import type { SubjectsRepository } from '@/application/repositories/subjects-repository.ts'

export class FetchSubjectsByCodeUseCase {
  constructor(private subjectsRepository: SubjectsRepository) {}

  async execute(code: string): Promise<FetchSubjectsByCodeUseCaseResponse> {
    const subjects = await this.subjectsRepository.fetchByCode(code)

    return subjects
  }
}
