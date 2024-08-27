import type { Subject } from '@/domain/entities/subject.entity.ts'

export interface FetchSubjectsByNameUseCaseRequest {
  name: string
}

export type FetchSubjectsByNameUseCaseResponse = Subject[]
