import type { ProfessorsRepository } from '@/domain/projects/application/repositories/professors-repository.ts'
import type { Professor } from '../../enterprise/entities/professor.ts'

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
