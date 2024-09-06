import { FetchSubjectsByNameUseCase } from '@/domain/deck/application/use-cases/fetch-subjects-by-name.ts'
import { PrismaSubjectsRepository } from '@/infra/database/prisma/repositories/subjects-repository.ts'

export function makeFetchSubjectByNameUseCase() {
  const subjectRepository = new PrismaSubjectsRepository()
  const fetchSubjectByNameUseCase = new FetchSubjectsByNameUseCase(
    subjectRepository,
  )

  return fetchSubjectByNameUseCase
}
