import type { InvalidCredentialsError } from '@/application/use-cases/errors/invalid-credentials.error.ts'
import type { TrailNotFoundError } from '@/application/use-cases/trails/errors/trail-not-found.error.ts'
import type { Either } from '@/domain/core/logic/either.ts'
import type { Trail } from '@/domain/entities/trail.entity.ts'

export interface UpdateTrailUseCaseRequest {
  id: string
  name: string
}

export type UpdateTrailUseCaseResponse = Either<
  InvalidCredentialsError | TrailNotFoundError,
  Trail
>
