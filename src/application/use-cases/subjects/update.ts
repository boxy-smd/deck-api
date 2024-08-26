import type {
  UpdateSubjectUseCaseRequest,
  UpdateSubjectUseCaseResponse,
} from '@/application/dtos/subjects/update-dtos.ts'
import type { SubjectsRepository } from '@/application/repositories/subjects-repository.ts'
import { left, right } from '@/domain/core/logic/either.ts'
import { InvalidCredentialsError } from '../errors/invalid-credentials.error.ts'
import { SubjectNotFoundError } from './errors/subject-not-found.error.ts'

export class UpdateSubjectUseCase {
  constructor(private subjectsRepository: SubjectsRepository) {}

  async execute({
    id,
    name,
  }: UpdateSubjectUseCaseRequest): Promise<UpdateSubjectUseCaseResponse> {
    const isNameEmpty = !name

    if (isNameEmpty) {
      return left(new InvalidCredentialsError())
    }

    const subjectNotExists = !(await this.subjectsRepository.findById(id))

    if (subjectNotExists) {
      return left(new SubjectNotFoundError())
    }

    const subject = await this.subjectsRepository.update(id, {
      name,
    })
    const isSubjectNotFound = !subject

    if (isSubjectNotFound) {
      return left(new SubjectNotFoundError())
    }

    return right(subject)
  }
}
