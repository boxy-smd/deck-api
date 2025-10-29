import { FetchTrailsUseCase } from '@/@core/domain/projects/application/use-cases/fetch-trails'
import { PrismaTrailsRepository } from '@/@infra/database/prisma/repositories/trails-repository'

export function makeFetchTrailsUseCase() {
  const trailsRepository = new PrismaTrailsRepository()
  const fetchTrailsUseCase = new FetchTrailsUseCase(trailsRepository)

  return fetchTrailsUseCase
}
