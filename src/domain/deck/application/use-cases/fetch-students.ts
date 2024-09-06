import type { Student } from '../../enterprise/entities/student.ts'
import type { StudentsRepository } from '../repositories/students-repository.ts'

interface FetchStudentsUseCaseRequest {
  name?: string
}

type FetchStudentsUseCaseResponse = Student[]

export class FetchStudentsUseCase {
  constructor(private readonly studentsRepository: StudentsRepository) {}

  async execute({
    name,
  }: FetchStudentsUseCaseRequest): Promise<FetchStudentsUseCaseResponse> {
    if (name) {
      return await this.studentsRepository.findManyByName(name)
    }

    return await this.studentsRepository.findAll()
  }
}
