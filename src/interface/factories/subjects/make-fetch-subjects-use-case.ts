import { FetchSubjectsUseCase } from '@/domain/projects/application/use-cases/fetch-subjects.ts'
import { PrismaSubjectsRepository } from '@/infra/database/prisma/repositories/subjects-repository.ts'

export function makeFetchSubjectsUseCase() {
  const subjectsRepository = new PrismaSubjectsRepository()
  const fetchSubjectsUseCase = new FetchSubjectsUseCase(subjectsRepository)

  return fetchSubjectsUseCase
}
