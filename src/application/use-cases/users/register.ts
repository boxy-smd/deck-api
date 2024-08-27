import type { UsersRepository } from '@/application/repositories/users-repository.ts'
import { type Either, left, right } from '@/domain/core/logic/either.ts'
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
}

type RegisterUseCaseResponse = Either<
  InvalidCredentialsError | EmailBadFormattedError | UserAlreadyExistsError,
  User
>

export class RegisterUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private encrypter: Encrypter,
  ) {}

  public async execute({
    name,
    username,
    email,
    password,
    semester,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const areRequiredFieldsMissing = !(
      name &&
      username &&
      email &&
      password &&
      semester
    )

    if (areRequiredFieldsMissing) return left(new InvalidCredentialsError())

    const isUsernameTaken = await this.usersRepository.findByUsername(username)

    if (isUsernameTaken)
      return left(new UserAlreadyExistsError('This username is already taken.'))

    const isEmailTaken = await this.usersRepository.findByEmail(email)

    if (isEmailTaken)
      return left(new UserAlreadyExistsError('This email is already taken.'))

    const passwordHash = await User.hashPassword(password, this.encrypter)

    const userOrError = User.create({
      name,
      username,
      email,
      passwordHash,
      semester,
    })

    if (userOrError.isLeft()) {
      return left(userOrError.value)
    }

    const user = userOrError.value

    await this.usersRepository.create(user)

    return right(user)
  }
}
