import type {
  FetchSubjectsByNameUseCaseRequest,
  FetchSubjectsByNameUseCaseResponse,
} from '@/application/dtos/subjects/fetch-by-name-dtos.ts'
import type { SubjectsRepository } from '@/application/repositories/subjects-repository.ts'

export class FetchSubjectsByNameUseCase {
  constructor(private subjectsRepository: SubjectsRepository) {}

  async execute({
    name,
  }: FetchSubjectsByNameUseCaseRequest): Promise<FetchSubjectsByNameUseCaseResponse> {
    const subjects = await this.subjectsRepository.fetchByName(name)

    return subjects
  }
}
