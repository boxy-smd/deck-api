import { type Either, left, right } from '@/core/either.ts'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.ts'
import { StudentProfile } from '../../enterprise/entities/value-objects/student-profile.ts'
import type { ProjectsRepository } from '../repositories/projects-repository.ts'
import type { StudentsRepository } from '../repositories/students-repository.ts'

interface GetProfileUseCaseRequest {
  username: string
}

type GetProfileUseCaseResponse = Either<ResourceNotFoundError, StudentProfile>

export class GetProfileUseCase {
  constructor(
    private studentRepository: StudentsRepository,
    private projectRepository: ProjectsRepository,
  ) {}

  async execute({
    username,
  }: GetProfileUseCaseRequest): Promise<GetProfileUseCaseResponse> {
    const student = await this.studentRepository.findByUsername(username)

    if (!student) {
      return left(new ResourceNotFoundError('Student not found.'))
    }

    const posts = await this.projectRepository.findManyPostsByQuery({
      authorId: student.id.toString(),
    })

    return right(
      StudentProfile.create({
        id: student.id,
        name: student.name,
        username: student.username,
        about: student.about,
        profileUrl: student.profileUrl,
        semester: student.semester,
        createdAt: student.createdAt,
        updatedAt: student.updatedAt,
        trails: student.trails.map(trail => trail.name),
        posts,
      }),
    )
  }
}
