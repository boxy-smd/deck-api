import { FetchProfessorsUseCase } from '@/domain/projects/application/use-cases/fetch-professors.ts'
import { PrismaProfessorsRepository } from '@/infra/database/prisma/repositories/professors-repository.ts'

export function makeFetchProfessorsUseCase() {
  const professorsRepository = new PrismaProfessorsRepository()
  const fetchProfessorsUseCase = new FetchProfessorsUseCase(
    professorsRepository,
  )

  return fetchProfessorsUseCase
}
