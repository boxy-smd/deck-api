import { FetchSubjectsUseCase } from '@/domain/projects/application/use-cases/fetch-subjects'
import { PrismaSubjectsRepository } from '@/infra/database/prisma/repositories/subjects-repository'

export function makeFetchSubjectsUseCase() {
  const subjectsRepository = new PrismaSubjectsRepository()
  const fetchSubjectsUseCase = new FetchSubjectsUseCase(subjectsRepository)

  return fetchSubjectsUseCase
}
