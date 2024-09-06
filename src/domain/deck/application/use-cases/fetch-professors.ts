import type { Professor } from '../../enterprise/entities/professor.ts'
import type { ProfessorsRepository } from '../repositories/professors-repository.ts'

interface FetchProfessorsUseCaseRequest {
  name?: string
}

type FetchProfessorsUseCaseResponse = Professor[]

export class FetchProfessorsUseCase {
  constructor(private readonly professorsRepository: ProfessorsRepository) {}

  async execute({
    name,
  }: FetchProfessorsUseCaseRequest): Promise<FetchProfessorsUseCaseResponse> {
    if (name) {
      return await this.professorsRepository.findManyByName(name)
    }

    return await this.professorsRepository.findAll()
  }
}
