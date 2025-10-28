import { FetchTrailsUseCase } from '@/domain/projects/application/use-cases/fetch-trails.ts'
import { PrismaTrailsRepository } from '@/infra/database/prisma/repositories/trails-repository.ts'

export function makeFetchTrailsUseCase() {
  const trailsRepository = new PrismaTrailsRepository()
  const fetchTrailsUseCase = new FetchTrailsUseCase(trailsRepository)

  return fetchTrailsUseCase
}
