import { type Either, left, right } from '@/@shared/kernel/either'
import type { InvalidCredentialsError } from '@/@shared/kernel/errors/invalid-credentials.error'
import type { ResourceAlreadyExistsError } from '@/@shared/kernel/errors/resource-already-exists.error'
import { ResourceNotFoundError } from '@/@shared/kernel/errors/resource-not-found.error'
import { Injectable } from '@nestjs/common'
import { Semester } from '../../../domain/users/value-objects/semester'
import { TrailsRepository } from '../../projects/repositories/trails-repository'
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

    const newSemester = Semester.create(semester ?? user.profile.semester.value)

    if (newSemester.isLeft()) {
      return left(newSemester.value)
    }

    user.updateAbout(about ? user.about : undefined)

    if (user.profile) {
      user.profile.updateSemester(newSemester.value as Semester)
    }

    user.changeProfilePicture(profileUrl ? user.profileUrl : undefined)

    for (const trailId of trailsIds ?? []) {
      const trail = await this.trailsRepository.findById(trailId)

      if (!trail) {
        return left(
          new ResourceNotFoundError(`Trail with ID ${trailId} not found.`),
        )
      }

      user.addTrailToProfile(trail.id)
    }

    await this.usersRepository.save(user)

    return right(UserDTOMapper.toDTO(user))
  }
}
