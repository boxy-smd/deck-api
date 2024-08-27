import type {
  FetchProfessorsByNameUseCaseRequest,
  FetchProfessorsByNameUseCaseResponse,
} from '@/application/dtos/professors/fetch-by-name-dtos.ts'
import type { ProfessorsRepository } from '@/application/repositories/professors-repository.ts'

export class FetchProfessorsByNameUseCase {
  constructor(private professorsRepository: ProfessorsRepository) {}

  async execute({
    name,
  }: FetchProfessorsByNameUseCaseRequest): Promise<FetchProfessorsByNameUseCaseResponse> {
    const professors = await this.professorsRepository.fetchByName(name)

    return professors
  }
}
