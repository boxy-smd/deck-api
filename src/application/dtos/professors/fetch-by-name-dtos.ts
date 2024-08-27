import type { Professor } from '@/domain/entities/professor.entity.ts'

export interface FetchProfessorsByNameUseCaseRequest {
  name: string
}

export type FetchProfessorsByNameUseCaseResponse = Professor[]
