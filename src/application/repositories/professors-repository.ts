import type { Repository } from '@/domain/core/interfaces/repository.ts'
import type {
  Professor,
  ProfessorProps,
} from '@/domain/entities/professor.entity.ts'

export type UpdateProfessorRequest = Partial<Pick<ProfessorProps, 'name'>>

export interface ProfessorsRepository
  extends Repository<Professor, UpdateProfessorRequest> {
  fetch(): Promise<Professor[]>
  fetchByName(name: string): Promise<Professor[]>
}
