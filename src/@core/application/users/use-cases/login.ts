import { type Either, left, right } from '@/@shared/kernel/either'
import { InvalidCredentialsError } from '@/@shared/kernel/errors/invalid-credentials.error'
import { Injectable } from '@nestjs/common'
import { HashComparer } from '../cryptography/hash-comparer'
import { UsersRepository } from '../repositories/users-repository'

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

@Injectable()
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
