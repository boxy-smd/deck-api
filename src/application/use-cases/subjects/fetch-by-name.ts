import type { FetchSubjectsByNameUseCaseResponse } from '@/application/dtos/subjects/fetch-by-name-dtos.ts'
import type { SubjectsRepository } from '@/application/repositories/subjects-repository.ts'

export class FetchSubjectsByNameUseCase {
  constructor(private subjectsRepository: SubjectsRepository) {}

  async execute(name: string): Promise<FetchSubjectsByNameUseCaseResponse> {
    const subjects = await this.subjectsRepository.fetchByName(name)

    return subjects
  }
}
