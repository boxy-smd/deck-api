import { FetchAllProfessorsUseCase } from '@/domain/deck/application/use-cases/fetch-all-professors.ts'
import { PrismaProfessorsRepository } from '@/infra/database/prisma/repositories/professors-repository.ts'

export function makeFetchAllProfessorsUseCase() {
  const professorsRepository = new PrismaProfessorsRepository()
  const fetchProfessorsUseCase = new FetchAllProfessorsUseCase(
    professorsRepository,
  )

  return fetchProfessorsUseCase
}
