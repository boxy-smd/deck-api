import type { Trail } from '@/@core/domain/projects/entities/trail'
import { type Either, left, right } from '@/@shared/kernel/either'
import { ResourceAlreadyExistsError } from '@/@shared/kernel/errors/resource-already-exists.error'
import { ResourceNotFoundError } from '@/@shared/kernel/errors/resource-not-found.error'
import { Injectable } from '@nestjs/common'
import { User } from '../../../domain/users/entities/user'
import { Email } from '../../../domain/users/value-objects/email'
import { UserRole } from '../../../domain/users/value-objects/user-role'
import { UserStatus } from '../../../domain/users/value-objects/user-status'
import { Username } from '../../../domain/users/value-objects/username'
import { TrailsRepository } from '../../projects/repositories/trails-repository'
import { HashGenerator } from '../cryptography/hash-generator'
import { type UserDTO, UserDTOMapper } from '../dtos/user.dto'
import type { EmailBadFormattedError } from '../errors/email-bad-formatted.error'
import type { SemesterOutOfBoundsError } from '../errors/semester-out-of-bounds.error'
import type { UsernameBadFormattedError } from '../errors/username-bad-formatted.error'
import type { UsernameInvalidSizeError } from '../errors/username-invalid-size.error'
import { UsersRepository } from '../repositories/users-repository'

interface RegisterUseCaseRequest {
  name: string
  username: string
  email: string
  password: string
  semester: number
  trailsIds: string[]
  about?: string
  profileUrl?: string
}

type RegisterUseCaseResponse = Either<
  | ResourceNotFoundError
  | ResourceAlreadyExistsError
  | EmailBadFormattedError
  | UsernameBadFormattedError
  | UsernameInvalidSizeError
  | SemesterOutOfBoundsError,
  UserDTO
>

@Injectable()
export class RegisterUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private trailsRepository: TrailsRepository,
    private hasher: HashGenerator,
  ) {}

  public async execute(
    request: RegisterUseCaseRequest,
  ): Promise<RegisterUseCaseResponse> {
    const isUsernameTaken = await this.usersRepository.findByUsername(
      request.username,
    )

    if (isUsernameTaken) {
      return left(
        new ResourceAlreadyExistsError('O nome de usuário já está em uso'),
      )
    }

    const isEmailTaken = await this.usersRepository.findByEmail(request.email)

    if (isEmailTaken) {
      return left(new ResourceAlreadyExistsError('Este e-mail já está em uso'))
    }

    const passwordHash = await this.hasher.hash(request.password)

    const validatedEmailOrError = Email.create(request.email)

    if (validatedEmailOrError.isLeft()) {
      return left(validatedEmailOrError.value)
    }

    const validatedEmail = validatedEmailOrError.value

    const validatedUsername = Username.create(request.username)

    if (validatedUsername.isLeft()) {
      return left(validatedUsername.value)
    }

    const username = validatedUsername.value

    const user = User.create({
      name: request.name,
      username,
      email: validatedEmail,
      passwordHash,
      about: request.about,
      profileUrl: request.profileUrl,
      role: UserRole.STUDENT,
      status: UserStatus.ACTIVE,
    })

    user.createProfile(request.semester)

    const trails: Trail[] = []

    for (const trailId of request.trailsIds) {
      const trail = await this.trailsRepository.findById(trailId)

      if (!trail) {
        return left(new ResourceNotFoundError('Trilha não encontrada'))
      }

      trails.push(trail)
      user.addTrailToProfile(trail.id)
    }

    await this.usersRepository.create(user)

    const userDetails = UserDTOMapper.toDTO(user)

    return right(userDetails)
  }
}
