import type { SubjectsRepository } from '@/domain/deck/application/repositories/subjects-repository.ts'
import type { Subject } from '@/domain/deck/enterprise/entities/subject.entity.ts'

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
