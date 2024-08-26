import { CreateSubjectUseCase } from '@/application/use-cases/subjects/create.ts'
import { DrizzleSubjectsRepository } from '@/infra/database/drizzle/repositories/subjects-repository.ts'

export function makeCreateSubjectUseCase() {
  const subjectsRepository = new DrizzleSubjectsRepository()
  const createSubjectUseCase = new CreateSubjectUseCase(subjectsRepository)

  return createSubjectUseCase
}
