import type {
  LoginUseCaseRequest,
  LoginUseCaseResponse,
} from '@/application/dtos/users/login-dtos.ts'
import type { UsersRepository } from '@/application/repositories/users-repository.ts'
import { left, right } from '@/domain/core/logic/either.ts'
import { InvalidCredentialsError } from '../errors/invalid-credentials.error.ts'
import type { Encrypter } from './cryptography/encrypter.ts'

export class LoginUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private encrypter: Encrypter,
  ) {}

  public async execute({
    email,
    password,
  }: LoginUseCaseRequest): Promise<LoginUseCaseResponse> {
    const isEmptyCredentials = !(email && password)

    if (isEmptyCredentials) return left(new InvalidCredentialsError())

    const user = await this.usersRepository.findByEmail(email)
    const isUserNotFound = !user

    if (isUserNotFound) return left(new InvalidCredentialsError())

    const isPasswordValid = await this.encrypter.compare(
      password,
      user.passwordHash,
    )

    if (isPasswordValid) return right(user)

    return left(new InvalidCredentialsError())
  }
}
