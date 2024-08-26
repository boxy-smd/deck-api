import type {
  FetchByQueryUseCaseRequest,
  FetchByQueryUseCaseResponse,
} from '@/application/dtos/subjects/fetch-by-query-dtos.ts'
import type { SubjectsRepository } from '@/application/repositories/subjects-repository.ts'

export class FetchByQueryUseCase {
  constructor(private subjectsRepository: SubjectsRepository) {}

  async execute({
    name,
  }: FetchByQueryUseCaseRequest): Promise<FetchByQueryUseCaseResponse> {
    const subjects = await this.subjectsRepository.fetchByQuery({
      name,
    })

    return subjects
  }
}
