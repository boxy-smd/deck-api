import { FetchTrailsUseCase } from '@/application/use-cases/trails/fetch.ts'
import { PrismaTrailsRepository } from '@/infra/database/prisma/repositories/trails-repository.ts'

export function makeFetchTrailsUseCase() {
  const trailsRepository = new PrismaTrailsRepository()
  const fetchTrailsUseCase = new FetchTrailsUseCase(trailsRepository)

  return fetchTrailsUseCase
}
