import type {
  LoginUseCaseRequest,
  LoginUseCaseResponse,
} from '@/application/dtos/users/login-dtos.ts'
import type {} from '@/application/dtos/users/register-dtos.ts'
import type { UsersRepository } from '@/application/repositories/users-repository.ts'
import { left, right } from '@/domain/core/logic/either.ts'
import type { Encrypter } from './cryptography/encrypter.ts'
import { InvalidCredentialsError } from './errors/invalid-credentials.error.ts'

export class LoginUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private encrypter: Encrypter,
  ) {}

  public async execute({
    email,
    password,
  }: LoginUseCaseRequest): Promise<LoginUseCaseResponse> {
    const hasEmptyFields = !(email && password)

    if (hasEmptyFields) return left(new InvalidCredentialsError())

    const user = await this.usersRepository.findByEmail(email)

    if (!user) return left(new InvalidCredentialsError())

    const isPasswordCorrect = await this.encrypter.compare(
      password,
      user.passwordHash,
    )

    if (!isPasswordCorrect) return left(new InvalidCredentialsError())

    return right(user)
  }
}
