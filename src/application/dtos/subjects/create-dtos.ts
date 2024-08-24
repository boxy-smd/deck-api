import type { InvalidCredentialsError } from '@/application/use-cases/errors/invalid-credentials.error.ts'
import type { SubjectAlreadyExistsError } from '@/application/use-cases/subjects/errors/subject-already-exists.error.ts'
import type { Either } from '@/domain/core/logic/either.ts'
import type { Subject } from '@/domain/entities/subject.entity.ts'

export interface CreateSubjectRequest {
  name: string
  code: string
}

export type CreateSubjectResponse = Either<
  InvalidCredentialsError | SubjectAlreadyExistsError,
  Subject
>
