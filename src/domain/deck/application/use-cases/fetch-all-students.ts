import type { Student } from '../../enterprise/entities/student.ts'
import type { StudentsRepository } from '../repositories/students-repository.ts'

type FetchAllStudentsUseCaseResponse = Student[]

export class FetchAllStudentsUseCase {
  constructor(private readonly studentsRepository: StudentsRepository) {}

  async execute(): Promise<FetchAllStudentsUseCaseResponse> {
    return await this.studentsRepository.fetchAll()
  }
}
