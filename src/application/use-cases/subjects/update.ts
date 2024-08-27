import type { SubjectsRepository } from '@/application/repositories/subjects-repository.ts'
import { type Either, left, right } from '@/domain/core/logic/either.ts'
import type { Subject } from '@/domain/entities/subject.entity.ts'
import { InvalidCredentialsError } from '../errors/invalid-credentials.error.ts'
import { SubjectNotFoundError } from './errors/subject-not-found.error.ts'

export interface UpdateSubjectUseCaseRequest {
  id: string
  name: string
}

export type UpdateSubjectUseCaseResponse = Either<
  InvalidCredentialsError | SubjectNotFoundError,
  Subject
>

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
