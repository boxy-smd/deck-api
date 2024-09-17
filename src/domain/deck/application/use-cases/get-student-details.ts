import { type Either, left, right } from '@/core/either.ts'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error.ts'
import type { StudentProfile } from '../../enterprise/entities/value-objects/student-profile.ts'
import type { StudentsRepository } from '../repositories/students-repository.ts'

interface GetStudentDetailsUseCaseRequest {
  studentId: string
}

type GetStudentDetailsUseCaseResponse = Either<
  ResourceNotFoundError,
  StudentProfile
>

export class GetStudentDetailsUseCase {
  constructor(private readonly studentRepository: StudentsRepository) {}

  async execute({
    studentId,
  }: GetStudentDetailsUseCaseRequest): Promise<GetStudentDetailsUseCaseResponse> {
    const profile = await this.studentRepository.findProfileById(studentId)

    if (!profile) {
      return left(new ResourceNotFoundError('Student not found.'))
    }

    return right(profile)
  }
}
