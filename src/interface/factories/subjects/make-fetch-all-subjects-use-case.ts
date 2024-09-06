import { FetchAllSubjectsUseCase } from '@/domain/deck/application/use-cases/fetch-all-subjects.ts'
import { PrismaSubjectsRepository } from '@/infra/database/prisma/repositories/subjects-repository.ts'

export function makeFetchAllSubjectsUseCase() {
  const subjectsRepository = new PrismaSubjectsRepository()
  const fetchSubjectsUseCase = new FetchAllSubjectsUseCase(subjectsRepository)

  return fetchSubjectsUseCase
}
