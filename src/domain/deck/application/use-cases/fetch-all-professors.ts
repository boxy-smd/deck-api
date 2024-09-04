import type { Professor } from '../../enterprise/entities/professor.ts'
import type { ProfessorsRepository } from '../repositories/professors-repository.ts'

type FetchAllProfessorsUseCaseResponse = Professor[]

export class FetchAllProfessorsUseCase {
  constructor(private readonly professorsRepository: ProfessorsRepository) {}

  async execute(): Promise<FetchAllProfessorsUseCaseResponse> {
    return await this.professorsRepository.fetchAll()
  }
}
