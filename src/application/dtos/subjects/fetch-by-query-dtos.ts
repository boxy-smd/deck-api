import type { Subject } from '@/domain/entities/subject.entity.ts'

export interface FetchByQueryUseCaseRequest {
  name: string
}

export type FetchByQueryUseCaseResponse = Subject[]
