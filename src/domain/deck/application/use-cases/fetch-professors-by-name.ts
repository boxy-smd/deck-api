import type { ProfessorsRepository } from '@/domain/deck/application/repositories/professors-repository.ts'
import type { Professor } from '@/domain/deck/enterprise/entities/professor.entity.ts'

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
