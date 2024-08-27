import type { SubjectsRepository } from '@/application/repositories/subjects-repository.ts'
import { type Either, left, right } from '@/domain/core/logic/either.ts'
import { Subject } from '@/domain/entities/subject.entity.ts'
import { InvalidCredentialsError } from '../errors/invalid-credentials.error.ts'
import { SubjectAlreadyExistsError } from './errors/subject-already-exists.error.ts'

interface CreateSubjectUseCaseRequest {
  name: string
}

type CreateSubjectUseCaseResponse = Either<
  InvalidCredentialsError | SubjectAlreadyExistsError,
  Subject
>

export class CreateSubjectUseCase {
  constructor(private subjectsRepository: SubjectsRepository) {}

  async execute({
    name,
  }: CreateSubjectUseCaseRequest): Promise<CreateSubjectUseCaseResponse> {
    const isNameEmpty = !name

    if (isNameEmpty) {
      return left(new InvalidCredentialsError())
    }

    const subjectAlreadyExists = await this.subjectsRepository.findByName(name)

    if (subjectAlreadyExists) {
      return left(new SubjectAlreadyExistsError())
    }

    const subject = Subject.create({
      name,
    })

    await this.subjectsRepository.create(subject)

    return right(subject)
  }
}
