import type { Either } from '@/domain/core/logic/either.ts'
import type { Subject } from '@/domain/entities/subject.entity.ts'

export type FetchSubjectsByNameResponse = Either<void, Subject[]>
