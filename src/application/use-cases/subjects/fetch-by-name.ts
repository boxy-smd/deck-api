import type { FetchSubjectsByNameResponse } from '@/application/dtos/subjects/fetch-by-name-dtos.ts'
import type { SubjectsRepository } from '@/application/repositories/subjects-repository.ts'
import { right } from '@/domain/core/logic/either.ts'

export class FetchSubjectsByNameUseCase {
  constructor(private subjectsRepository: SubjectsRepository) {}

  async execute(name: string): Promise<FetchSubjectsByNameResponse> {
    const subjects = await this.subjectsRepository.fetchByName(name)

    return right(subjects)
  }
}
