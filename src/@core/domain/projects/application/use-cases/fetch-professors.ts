import type { ProfessorsRepository } from '@/@core/domain/projects/application/repositories/professors-repository'
import { Injectable } from '@nestjs/common'
import type { Professor } from '../../enterprise/entities/professor'

interface FetchProfessorsUseCaseRequest {
  name?: string
}

type FetchProfessorsUseCaseResponse = Professor[]

@Injectable()
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
