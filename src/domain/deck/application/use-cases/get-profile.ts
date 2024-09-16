import { type Either, left, right } from '@/core/either.ts'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error.ts'
import type { StudentProfile } from '../../enterprise/entities/value-objects/student-profile.ts'
import type { StudentsRepository } from '../repositories/students-repository.ts'

interface GetProfileUseCaseRequest {
  username: string
}

type GetProfileUseCaseResponse = Either<ResourceNotFoundError, StudentProfile>

export class GetProfileUseCase {
  constructor(private studentRepository: StudentsRepository) {}

  async execute({
    username,
  }: GetProfileUseCaseRequest): Promise<GetProfileUseCaseResponse> {
    const profile = await this.studentRepository.findProfileByUsername(username)

    if (!profile) {
      return left(new ResourceNotFoundError('Student not found.'))
    }

    return right(profile)
  }
}
