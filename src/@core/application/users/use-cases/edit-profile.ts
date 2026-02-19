import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '@/@shared/kernel/either'
import type { InvalidCredentialsError } from '@/@shared/kernel/errors/invalid-credentials.error'
import type { ResourceAlreadyExistsError } from '@/@shared/kernel/errors/resource-already-exists.error'
import { ResourceNotFoundError } from '@/@shared/kernel/errors/resource-not-found.error'
import type { Trail } from '../../../domain/projects/entities/trail'
import type { StudentProfile } from '../../../domain/users/entities/student-profile'
import type { User } from '../../../domain/users/entities/user'
import { Semester } from '../../../domain/users/value-objects/semester'
import { TrailsRepository } from '../../trails/repositories/trails-repository'
import { type UserDTO, UserDTOMapper } from '../dtos/user.dto'
import type { SemesterOutOfBoundsError } from '../errors/semester-out-of-bounds.error'
import { UsersRepository } from '../repositories/users-repository'

interface EditProfileUseCaseRequest {
  userId: string
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
  UserDTO
>

@Injectable()
export class EditProfileUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly trailsRepository: TrailsRepository,
  ) {}

  async execute({
    userId,
    about,
    semester,
    profileUrl,
    trailsIds,
  }: EditProfileUseCaseRequest): Promise<EditProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError('User not found.'))
    }

    if (about !== undefined) {
      user.updateAbout(about)
    }

    if (profileUrl !== undefined) {
      user.changeProfilePicture(profileUrl)
    }

    if (semester !== undefined) {
      const result = this.updateSemester(user, semester)
      if (result.isLeft()) {
        return left(result.value)
      }
    }

    if (trailsIds !== undefined) {
      const result = await this.updateTrails(user, trailsIds)
      if (result.isLeft()) {
        return left(result.value)
      }
    }

    await this.usersRepository.save(user)

    return right(UserDTOMapper.toDTO(user))
  }

  private updateSemester(
    user: User,
    semester: number,
  ): Either<ResourceNotFoundError | SemesterOutOfBoundsError, null> {
    const profile = this.getStudentProfileOrError(user)
    if (profile.isLeft()) {
      return left(profile.value)
    }

    const newSemester = Semester.create(semester)
    if (newSemester.isLeft()) {
      return left(newSemester.value)
    }

    profile.value.updateSemester(newSemester.value as Semester)
    return right(null)
  }

  private async updateTrails(
    user: User,
    trailsIds: string[],
  ): Promise<Either<ResourceNotFoundError, null>> {
    const profile = this.getStudentProfileOrError(user)
    if (profile.isLeft()) {
      return left(profile.value)
    }

    const uniqueTrailIds = [...new Set(trailsIds)]
    const trailsById = await this.findTrailsById(uniqueTrailIds)
    if (trailsById.isLeft()) {
      return left(trailsById.value)
    }

    const desiredIds = new Set(uniqueTrailIds)
    const currentTrailIds = profile.value.trailsIds
    const currentIds = new Set(
      currentTrailIds.map(trailId => trailId.toString()),
    )

    for (const existingId of currentTrailIds) {
      if (!desiredIds.has(existingId.toString())) {
        user.removeTrailFromProfile(existingId)
      }
    }

    for (const trailId of uniqueTrailIds) {
      if (currentIds.has(trailId)) {
        continue
      }

      const trail = trailsById.value.get(trailId)
      if (!trail) {
        return left(
          new ResourceNotFoundError(`Trail with ID ${trailId} not found.`),
        )
      }

      user.addTrailToProfile(trail.id)
    }

    return right(null)
  }

  private getStudentProfileOrError(
    user: User,
  ): Either<ResourceNotFoundError, StudentProfile> {
    if (!user.profile) {
      return left(new ResourceNotFoundError('Student profile not found.'))
    }

    return right(user.profile)
  }

  private async findTrailsById(
    trailIds: string[],
  ): Promise<Either<ResourceNotFoundError, Map<string, Trail>>> {
    const trailsById = new Map<string, Trail>()

    for (const trailId of trailIds) {
      const trail = await this.trailsRepository.findById(trailId)

      if (!trail) {
        return left(
          new ResourceNotFoundError(`Trail with ID ${trailId} not found.`),
        )
      }

      trailsById.set(trailId, trail)
    }

    return right(trailsById)
  }
}
