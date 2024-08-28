import type { Repository } from '@/domain/core/interfaces/repository.ts'
import type {
  Professor,
  ProfessorProps,
} from '@/domain/entities/professor.entity.ts'

export type UpdateProfessorRequest = Partial<
  Omit<ProfessorProps, 'createdAt' | 'updatedAt'>
>

export interface ProfessorsRepository
  extends Repository<Professor, UpdateProfessorRequest> {
  fetchByName(name: string): Promise<Professor[]>
}
