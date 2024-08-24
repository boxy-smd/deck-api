import type { InvalidCredentialsError } from '@/application/use-cases/errors/invalid-credentials.error.ts'
import type { SubjectNotFoundError } from '@/application/use-cases/subjects/errors/subject-not-found.error.ts'
import type { Either } from '@/domain/core/logic/either.ts'
import type { Subject } from '@/domain/entities/subject.entity.ts'

export interface UpdateSubjectRequest {
  id: string
  name?: string
  code?: string
}

export type UpdateSubjectResponse = Either<
  InvalidCredentialsError | SubjectNotFoundError,
  Subject
>
