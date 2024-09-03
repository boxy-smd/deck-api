import { type Either, left, right } from '@/core/either.ts'
import { InvalidCredentialsError } from '@/core/errors/invalid-credentials.error.ts'
import type { Student } from '../../enterprise/student.entity.ts'
import type { StudentsRepository } from '../repositories/students-repository.ts'
import type { Encrypter } from './cryptography/encrypter.ts'

interface LoginUseCaseRequest {
  email: string
  password: string
}

type LoginUseCaseResponse = Either<InvalidCredentialsError, Student>

export class LoginUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private encrypter: Encrypter,
  ) {}

  public async execute({
    email,
    password,
  }: LoginUseCaseRequest): Promise<LoginUseCaseResponse> {
    if (!(email && password)) {
      return left(
        new InvalidCredentialsError('Email and password must be provided.'),
      )
    }

    const student = await this.studentsRepository.findByEmail(email)

    if (!student) {
      return left(new InvalidCredentialsError())
    }

    const isPasswordValid = await this.encrypter.compare(
      password,
      student.passwordHash,
    )

    if (!isPasswordValid) {
      return left(new InvalidCredentialsError())
    }

    return right(student)
  }
}
