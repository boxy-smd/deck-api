import type { Subject } from '@/domain/entities/subject.entity.ts'
import type { SubjectsRepository } from '@/domain/repositories/subjects-repository.ts'

export interface FetchSubjectsByNameUseCaseRequest {
  name: string
}

export type FetchSubjectsByNameUseCaseResponse = Subject[]

export class FetchSubjectsByNameUseCase {
  constructor(private subjectsRepository: SubjectsRepository) {}

  async execute({
    name,
  }: FetchSubjectsByNameUseCaseRequest): Promise<FetchSubjectsByNameUseCaseResponse> {
    const subjects = await this.subjectsRepository.fetchByName(name)

    return subjects
  }
}
