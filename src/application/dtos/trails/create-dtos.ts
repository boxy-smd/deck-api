import type { InvalidCredentialsError } from '@/application/use-cases/errors/invalid-credentials.error.ts'
import type { Either } from '@/domain/core/logic/either.ts'
import type { Trail } from '@/domain/entities/trail.entity.ts'

export interface CreateTrailUseCaseRequest {
  name: string
}

export type CreateTrailUseCaseResponse = Either<InvalidCredentialsError, Trail>
