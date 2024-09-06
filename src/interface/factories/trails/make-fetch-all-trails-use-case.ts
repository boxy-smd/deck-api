import { FetchAllTrailsUseCase } from '@/domain/deck/application/use-cases/fetch-all-trails.ts'
import { PrismaTrailsRepository } from '@/infra/database/prisma/repositories/trails-repository.ts'

export function makeFetchAllTrailsUseCase() {
  const trailsRepository = new PrismaTrailsRepository()
  const fetchTrailsUseCase = new FetchAllTrailsUseCase(trailsRepository)

  return fetchTrailsUseCase
}
