import { type Either, left, right } from '@/shared/either.ts'
import { InvalidCredentialsError } from '@/shared/errors/invalid-credentials.error.ts'
import type { HashComparer } from '../cryptography/hash-comparer.ts'
import type { UsersRepository } from '../repositories/users-repository.ts'

interface LoginUseCaseRequest {
  email: string
  password: string
}

type LoginUseCaseResponse = Either<
  InvalidCredentialsError,
  {
    id: string
  }
>

export class LoginUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashComparer: HashComparer,
  ) {}

  public async execute({
    email,
    password,
  }: LoginUseCaseRequest): Promise<LoginUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      return left(new InvalidCredentialsError())
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      user.passwordHash,
    )

    if (!isPasswordValid) {
      return left(new InvalidCredentialsError())
    }

    return right({
      id: user.id.toString(),
    })
  }
}
