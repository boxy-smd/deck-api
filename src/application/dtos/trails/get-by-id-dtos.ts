import type { TrailNotFoundError } from '@/application/use-cases/trails/errors/trail-not-found.error.ts'
import type { Either } from '@/domain/core/logic/either.ts'
import type { Trail } from '@/domain/entities/trail.entity.ts'

export type GetTrailByIdUseCaseResponse = Either<TrailNotFoundError, Trail>
