import type { TrailsRepository } from '@/@core/domain/projects/application/repositories/trails-repository'
import { type Either, left, right } from '@/@shared/kernel/either'
import { ResourceAlreadyExistsError } from '@/@shared/kernel/errors/resource-already-exists.error'
import { ResourceNotFoundError } from '@/@shared/kernel/errors/resource-not-found.error'
import { User } from '../../enterprise/entities/user'
import { Email } from '../../enterprise/value-objects/email'
import { UserRole } from '../../enterprise/value-objects/user-role'
import { UserStatus } from '../../enterprise/value-objects/user-status'
import { Username } from '../../enterprise/value-objects/username'
import type { HashGenerator } from '../cryptography/hash-generator'
import { EmailBadFormattedError } from '../errors/email-bad-formatted.error'
import type { SemesterOutOfBoundsError } from '../errors/semester-out-of-bounds.error'
import type { UsernameBadFormattedError } from '../errors/username-bad-formatted.error'
import type { UsernameInvalidSizeError } from '../errors/username-invalid-size.error'
import type { UsersRepository } from '../repositories/users-repository'

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
  User
>

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

    let validatedEmail: Email

    try {
      validatedEmail = Email.create(request.email)
    } catch (error) {
      if (error instanceof EmailBadFormattedError) {
        return left(error)
      }

      return left(new EmailBadFormattedError())
    }

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

    for (const trailId of request.trailsIds) {
      const trail = await this.trailsRepository.findById(trailId)

      if (!trail) {
        return left(new ResourceNotFoundError('Trilha não encontrada'))
      }

      user.addTrailToProfile(trail.id)
    }

    await this.usersRepository.create(user)

    return right(user)
  }
}
