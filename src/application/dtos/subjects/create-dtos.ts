import type { InvalidCredentialsError } from '@/application/use-cases/errors/invalid-credentials.error.ts'
import type { SubjectAlreadyExistsError } from '@/application/use-cases/subjects/errors/subject-already-exists.error.ts'
import type { Either } from '@/domain/core/logic/either.ts'
import type { Subject } from '@/domain/entities/subject.entity.ts'

export interface CreateSubjectUseCaseRequest {
  name: string
  code: string
}

export type CreateSubjectUseCaseResponse = Either<
  InvalidCredentialsError | SubjectAlreadyExistsError,
  Subject
>
