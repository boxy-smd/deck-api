import { FetchProfessorsByNameUseCase } from '@/application/use-cases/professors/fetch-by-name.ts'
import { PrismaProfessorsRepository } from '@/infra/database/prisma/repositories/professors-repository.ts'

export function makeFetchProfessorByNameUseCase() {
  const professorRepository = new PrismaProfessorsRepository()
  const fetchProfessorByNameUseCase = new FetchProfessorsByNameUseCase(
    professorRepository,
  )

  return fetchProfessorByNameUseCase
}
