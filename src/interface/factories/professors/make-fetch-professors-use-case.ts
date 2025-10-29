import { FetchProfessorsUseCase } from '@/domain/projects/application/use-cases/fetch-professors'
import { PrismaProfessorsRepository } from '@/infra/database/prisma/repositories/professors-repository'

export function makeFetchProfessorsUseCase() {
  const professorsRepository = new PrismaProfessorsRepository()
  const fetchProfessorsUseCase = new FetchProfessorsUseCase(
    professorsRepository,
  )

  return fetchProfessorsUseCase
}
