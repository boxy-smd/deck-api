import type { InvalidCredentialsError } from '@/application/use-cases/users/errors/invalid-credentials.error.ts'
import type { Either } from '@/domain/core/logic/either.ts'
import type { User } from '@/domain/entities/user.entity.ts'
import type { EmailBadFormattedError } from '@/domain/value-objects/errors/email-bad-formatted.error.ts'

export interface LoginUseCaseRequest {
  email: string
  password: string
}

export type LoginUseCaseResponse = Either<
  InvalidCredentialsError | EmailBadFormattedError,
  User
>
