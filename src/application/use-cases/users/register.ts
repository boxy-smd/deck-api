import type { TrailsRepository } from '@/application/repositories/trails-repository.ts'
import type { UsersRepository } from '@/application/repositories/users-repository.ts'
import { type Either, left, right } from '@/domain/core/logic/either.ts'
import type { Trail } from '@/domain/entities/trail.entity.ts'
import { User } from '@/domain/entities/user.entity.ts'
import type { EmailBadFormattedError } from '@/domain/value-objects/errors/email-bad-formatted.error.ts'
import { InvalidCredentialsError } from '../errors/invalid-credentials.error.ts'
import type { Encrypter } from './cryptography/encrypter.ts'
import { UserAlreadyExistsError } from './errors/user-already-exists.error.ts'

interface RegisterUseCaseRequest {
  name: string
  username: string
  email: string
  password: string
  semester: number
  trailsIds?: string[]
  about?: string
  profileUrl?: string
}

type RegisterUseCaseResponse = Either<
  InvalidCredentialsError | EmailBadFormattedError | UserAlreadyExistsError,
  User
>

export class RegisterUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private trailsRepository: TrailsRepository,
    private encrypter: Encrypter,
  ) {}

  public async execute({
    name,
    username,
    email,
    password,
    semester,
    about,
    profileUrl,
    trailsIds,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    if (!(name && username && email && password && semester)) {
      return left(new InvalidCredentialsError())
    }

    const isUsernameTaken = await this.usersRepository.findByUsername(username)
    if (isUsernameTaken) {
      return left(new UserAlreadyExistsError('This username is already taken.'))
    }

    const isEmailTaken = await this.usersRepository.findByEmail(email)
    if (isEmailTaken) {
      return left(new UserAlreadyExistsError('This email is already taken.'))
    }

    const passwordHash = await User.hashPassword(password, this.encrypter)

    const trails: Trail[] = []
    if (trailsIds) {
      for (const trailId of trailsIds) {
        const trail = await this.trailsRepository.findById(trailId)
        if (!trail) {
          return left(new InvalidCredentialsError())
        }
        trails.push(trail)
      }
    }

    const userOrError = User.create({
      name,
      username,
      email,
      passwordHash,
      semester,
      about,
      profileUrl,
      trails,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    if (userOrError.isLeft()) {
      return left(userOrError.value)
    }

    const user = userOrError.value
    await this.usersRepository.create(user)

    return right(user)
  }
}
