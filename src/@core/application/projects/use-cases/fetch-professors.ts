import type { Professor } from '@/@core/domain/projects/entities/professor'
import { Injectable } from '@nestjs/common'
import { ProfessorsRepository } from '../repositories/professors-repository'

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
