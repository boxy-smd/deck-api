import type {
  RegisterUseCaseRequest,
  RegisterUseCaseResponse,
} from '@/application/dtos/users/register-dtos.ts'
import type { UsersRepository } from '@/application/repositories/users-repository.ts'
import { left, right } from '@/domain/core/logic/either.ts'
import { User } from '@/domain/entities/user.entity.ts'
import { EmailBadFormattedError } from '@/domain/value-objects/errors/email-bad-formatted.error.ts'
import type { Encrypter } from './cryptography/encrypter.ts'
import { InvalidCredentialsError } from './errors/invalid-credentials.error.ts'
import { UserAlreadyExistsError } from './errors/user-already-exists.error.ts'

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
    const hasEmptyFields = !(name && username && email && password && semester)

    if (hasEmptyFields) return left(new InvalidCredentialsError())

    const userAlreadyWithUsernameAlreadyExists =
      await this.usersRepository.findByUsername(username)

    if (userAlreadyWithUsernameAlreadyExists)
      return left(new UserAlreadyExistsError('This username is already taken.'))

    const userAlreadyWithEmailAlreadyExists =
      await this.usersRepository.findByEmail(email)

    if (userAlreadyWithEmailAlreadyExists)
      return left(new UserAlreadyExistsError('This email is already taken.'))

    const passwordHash = await User.hashPassword(password, this.encrypter)

    try {
      const user = User.create({
        name,
        username,
        email,
        passwordHash,
        semester,
      })

      await this.usersRepository.create(user)

      return right(user)
    } catch (error: unknown) {
      if (error instanceof EmailBadFormattedError)
        return left(new EmailBadFormattedError(error.message))

      return left(new InvalidCredentialsError('Unexpected error.'))
    }
  }
}
