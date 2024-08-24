import type {
  CreateSubjectRequest,
  CreateSubjectResponse,
} from '@/application/dtos/subjects/create-dtos.ts'
import type { SubjectsRepository } from '@/application/repositories/subjects-repository.ts'
import { left, right } from '@/domain/core/logic/either.ts'
import { Subject } from '@/domain/entities/subject.entity.ts'
import { InvalidCredentialsError } from '../errors/invalid-credentials.error.ts'
import { SubjectAlreadyExistsError } from './errors/subject-already-exists.error.ts'

export class CreateSubjectUseCase {
  constructor(private subjectsRepository: SubjectsRepository) {}

  async execute({
    name,
    code,
  }: CreateSubjectRequest): Promise<CreateSubjectResponse> {
    const areRequiredFieldsMissing = !(name && code)

    if (areRequiredFieldsMissing) {
      return left(new InvalidCredentialsError())
    }

    const isCodeAlreadyInUse = await this.subjectsRepository.findByCode(code)

    if (isCodeAlreadyInUse) {
      return left(new SubjectAlreadyExistsError())
    }

    const subject = Subject.create({
      name,
      code,
    })

    await this.subjectsRepository.create(subject)

    return right(subject)
  }
}
