import { type Either, left, right } from '@/core/either.ts'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.ts'
import type { Student } from '../../enterprise/entities/student.ts'
import type { StudentsRepository } from '../repositories/students-repository.ts'

interface GetProfileUseCaseRequest {
  studentId: string
}

type GetProfileUseCaseResponse = Either<ResourceNotFoundError, Student>

export class GetProfileUseCase {
  constructor(private studentRepository: StudentsRepository) {}

  async execute({
    studentId,
  }: GetProfileUseCaseRequest): Promise<GetProfileUseCaseResponse> {
    const student = await this.studentRepository.findById(studentId)

    if (!student) {
      return left(new ResourceNotFoundError('Student not found.'))
    }

    return right(student)
  }
}
