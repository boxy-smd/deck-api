import { type Either, left, right } from '@/core/either.ts'
import type { InvalidCredentialsError } from '@/core/errors/invalid-credentials.error.ts'
import type { ResourceAlreadyExistsError } from '@/core/errors/resource-already-exists.ts'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.ts'
import type { Student } from '../../enterprise/entities/student.ts'
import type { Trail } from '../../enterprise/entities/trail.ts'
import type { StudentsRepository } from '../repositories/students-repository.ts'
import type { TrailsRepository } from '../repositories/trails-repository.ts'

interface EditProfileUseCaseRequest {
  studentId: string
  name?: string
  about?: string
  semester?: number
  profileUrl?: string
  trailsIds?: string[]
}

type EditProfileUseCaseResponse = Either<
  InvalidCredentialsError | ResourceNotFoundError | ResourceAlreadyExistsError,
  Student
>

export class EditProfileUseCase {
  constructor(
    private readonly studentRepository: StudentsRepository,
    private readonly trailsRepository: TrailsRepository,
  ) {}

  async execute({
    studentId,
    name,
    about,
    semester,
    profileUrl,
    trailsIds,
  }: EditProfileUseCaseRequest): Promise<EditProfileUseCaseResponse> {
    const student = await this.studentRepository.findById(studentId)

    if (!student) {
      return left(new ResourceNotFoundError('Student not found.'))
    }

    const studentTrailsList = trailsIds
      ? await Promise.all(
          trailsIds.map(async trailId => {
            const trail = await this.trailsRepository.findById(trailId)

            return trail
          }),
        )
      : student.trails

    if (studentTrailsList.some(trail => !trail)) {
      return left(new ResourceNotFoundError('Trail not found.'))
    }

    student.name = name ?? student.name
    student.about = about ?? student.about
    student.semester = semester ?? student.semester
    student.profileUrl = profileUrl ?? student.profileUrl
    student.trails = studentTrailsList as Trail[]

    await this.studentRepository.save(student)

    return right(student)
  }
}
