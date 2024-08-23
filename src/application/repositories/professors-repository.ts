import type {
  Professor,
  ProfessorProps,
} from '@/domain/entities/professor.entity.ts'

export type UpdateProfessorRequest = Partial<
  Omit<ProfessorProps, 'createdAt' | 'updatedAt'>
>

export interface ProfessorsRepository {
  create(professor: Professor): Promise<Professor>
  findById(id: string): Promise<Professor | null>
  findByName(name: string): Promise<Professor[]>
  update(id: string, request: UpdateProfessorRequest): Promise<void>
  delete(id: string): Promise<void>
}
