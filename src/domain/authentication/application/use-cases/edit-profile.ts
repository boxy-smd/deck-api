import type { TrailsRepository } from '@/domain/projects/application/repositories/trails-repository'
import { type Either, left, right } from '@/shared/either'
import type { InvalidCredentialsError } from '@/shared/errors/invalid-credentials.error'
import type { ResourceAlreadyExistsError } from '@/shared/errors/resource-already-exists.error'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found.error'
import type { User } from '../../enterprise/entities/user'
import { Semester } from '../../enterprise/value-objects/semester'
import type { SemesterOutOfBoundsError } from '../errors/semester-out-of-bounds.error'
import type { UsersRepository } from '../repositories/users-repository'

interface EditProfileUseCaseRequest {
  studentId: string
  about?: string
  semester?: number
  profileUrl?: string
  trailsIds?: string[]
}

type EditProfileUseCaseResponse = Either<
  | InvalidCredentialsError
  | ResourceNotFoundError
  | ResourceAlreadyExistsError
  | SemesterOutOfBoundsError,
  User
>

export class EditProfileUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly trailsRepository: TrailsRepository,
  ) {}

  async execute({
    studentId,
    about,
    semester,
    profileUrl,
    trailsIds,
  }: EditProfileUseCaseRequest): Promise<EditProfileUseCaseResponse> {
    const student = await this.usersRepository.findById(studentId)

    if (!student?.profile) {
      return left(new ResourceNotFoundError('Student not found.'))
    }

    const newSemester = Semester.create(
      semester ?? student.profile.semester.value,
    )

    if (newSemester.isLeft()) {
      return left(newSemester.value)
    }

    student.updateAbout(about ?? student.about)
    student.profile.updateSemester(newSemester.value as Semester)
    student.changeProfilePicture(profileUrl ?? student.profileUrl)

    for (const trailId of trailsIds ?? []) {
      const trail = await this.trailsRepository.findById(trailId)

      if (!trail) {
        return left(
          new ResourceNotFoundError(`Trail with ID ${trailId} not found.`),
        )
      }

      student.addTrailToProfile(trail.id)
    }

    await this.usersRepository.save(student)

    return right(student)
  }
}
