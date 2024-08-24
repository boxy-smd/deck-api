import type { SubjectNotFoundError } from '@/application/use-cases/subjects/errors/subject-not-found.error.ts'
import type { Either } from '@/domain/core/logic/either.ts'
import type { Subject } from '@/domain/entities/subject.entity.ts'

export type GetSubjectByCodeUseCaseResponse = Either<SubjectNotFoundError, Subject>
