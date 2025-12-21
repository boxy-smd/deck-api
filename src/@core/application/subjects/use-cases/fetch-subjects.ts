import { Injectable } from '@nestjs/common'
import type { Subject } from '@/@core/domain/projects/entities/subject'
import { SubjectsRepository } from '../repositories/subjects-repository'

export interface FetchSubjectsUseCaseRequest {
  name?: string
}

type FetchSubjectsUseCaseResponse = Subject[]

@Injectable()
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
