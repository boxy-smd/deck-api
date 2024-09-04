import type { Subject } from '../../enterprise/entities/subject.ts'
import type { SubjectsRepository } from '../repositories/subjects-repository.ts'

type FetchSubjectsUseCaseResponse = Subject[]

export class FetchAllSubjectsUseCase {
  constructor(private readonly subjectsRepository: SubjectsRepository) {}

  async execute(): Promise<FetchSubjectsUseCaseResponse> {
    return await this.subjectsRepository.fetchAll()
  }
}
