import type { InvalidCredentialsError } from '@/application/use-cases/users/errors/invalid-credentials.error.ts'
import type { UserAlreadyExistsError } from '@/application/use-cases/users/errors/user-already-exists.error.ts'
import type { Either } from '@/domain/core/logic/either.ts'
import type { User } from '@/domain/entities/user.entity.ts'
import type { EmailBadFormattedError } from '@/domain/value-objects/errors/email-bad-formatted.error.ts'

export interface RegisterUseCaseRequest {
  name: string
  username: string
  email: string
  password: string
  semester: number
}

export type RegisterUseCaseResponse = Either<
  InvalidCredentialsError | EmailBadFormattedError | UserAlreadyExistsError,
  User
>
