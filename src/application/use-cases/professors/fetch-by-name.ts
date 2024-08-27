import type { ProfessorsRepository } from '@/application/repositories/professors-repository.ts'
import type { Professor } from '@/domain/entities/professor.entity.ts'

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
