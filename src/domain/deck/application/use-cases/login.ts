import { type Either, left, right } from '@/core/either.ts'
import { InvalidCredentialsError } from '@/core/errors/invalid-credentials.error.ts'
import type { StudentsRepository } from '../repositories/students-repository.ts'
import type { HashComparer } from './cryptography/hash-comparer.ts'

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
    private studentsRepository: StudentsRepository,
    private hashComparer: HashComparer,
  ) {}

  public async execute({
    email,
    password,
  }: LoginUseCaseRequest): Promise<LoginUseCaseResponse> {
    const student = await this.studentsRepository.findByEmail(email)

    if (!student) {
      return left(new InvalidCredentialsError())
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      student.passwordHash,
    )

    if (!isPasswordValid) {
      return left(new InvalidCredentialsError())
    }

    return right({
      id: student.id.toString(),
    })
  }
}
