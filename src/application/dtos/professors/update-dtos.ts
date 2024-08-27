import type { InvalidCredentialsError } from '@/application/use-cases/errors/invalid-credentials.error.ts'
import type { ProfessorNotFoundError } from '@/application/use-cases/professors/errors/professor-not-found.error.ts'
import type { Either } from '@/domain/core/logic/either.ts'
import type { Professor } from '@/domain/entities/professor.entity.ts'

export interface UpdateProfessorUseCaseRequest {
  id: string
  name: string
}

export type UpdateProfessorUseCaseResponse = Either<
  InvalidCredentialsError | ProfessorNotFoundError,
  Professor
>
