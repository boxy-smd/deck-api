import type { Subject } from '../../enterprise/entities/subject'
import type { SubjectsRepository } from '../repositories/subjects-repository'

export interface FetchSubjectsUseCaseRequest {
  name?: string
}

type FetchSubjectsUseCaseResponse = Subject[]

export class FetchSubjectsUseCase {
  constructor(private readonly subjectsRepository: SubjectsRepository) {}

  async execute({
    name,
  }: FetchSubjectsUseCaseRequest): Promise<FetchSubjectsUseCaseResponse> {
    if (name) {
      return await this.subjectsRepository.findManyByName(name)
    }

    return await this.subjectsRepository.findAll()
  }
}
