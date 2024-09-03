import type { Professor } from '@/domain/entities/professor.entity.ts'
import type { ProfessorsRepository } from '@/domain/repositories/professors-repository.ts'

interface FetchProfessorsByNameUseCaseRequest {
  name: string
}

type FetchProfessorsByNameUseCaseResponse = Professor[]

export class FetchProfessorsByNameUseCase {
  constructor(private professorsRepository: ProfessorsRepository) {}

  async execute({
    name,
  }: FetchProfessorsByNameUseCaseRequest): Promise<FetchProfessorsByNameUseCaseResponse> {
    const professors = await this.professorsRepository.fetchByName(name)

    return professors
  }
}
