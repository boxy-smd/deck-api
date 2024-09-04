import type { StudentsRepository } from '@/domain/deck/application/repositories/students-repository.ts'
import type { Student } from '@/domain/deck/enterprise/entities/student.ts'

interface FetchStudentsByQueryUseCaseRequest {
  name?: string
  username?: string
}

type FetchStudentsByQueryUseCaseResponse = Student[]

export class FetchStudentsByQueryUseCase {
  constructor(private studentsRepository: StudentsRepository) {}

  async execute({
    name,
    username,
  }: FetchStudentsByQueryUseCaseRequest): Promise<FetchStudentsByQueryUseCaseResponse> {
    const students = await this.studentsRepository.fetchByQuery({
      name,
      username,
    })

    return students
  }
}
