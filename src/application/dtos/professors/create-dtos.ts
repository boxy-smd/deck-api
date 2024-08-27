import type { InvalidCredentialsError } from '@/application/use-cases/errors/invalid-credentials.error.ts'
import type { Either } from '@/domain/core/logic/either.ts'
import type { Professor } from '@/domain/entities/professor.entity.ts'

export interface CreateProfessorUseCaseRequest {
  name: string
}

export type CreateProfessorUseCaseResponse = Either<
  InvalidCredentialsError,
  Professor
>
