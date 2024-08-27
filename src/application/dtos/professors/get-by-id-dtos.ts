import type { ProfessorNotFoundError } from '@/application/use-cases/professors/errors/professor-not-found.error.ts'
import type { Either } from '@/domain/core/logic/either.ts'
import type { Professor } from '@/domain/entities/professor.entity.ts'

export type GetProfessorByIdUseCaseResponse = Either<
  ProfessorNotFoundError,
  Professor
>
