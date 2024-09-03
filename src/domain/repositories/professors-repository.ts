import type {
  Professor,
  ProfessorProps,
} from '@/domain/entities/professor.entity.ts'

export interface ProfessorsRepository {
  findById(id: string): Promise<Professor | null>
  fetchAll(): Promise<Professor[]>
  fetchByName(name: string): Promise<Professor[]>
  create(professor: ProfessorProps): Promise<void>
  save(professor: Professor): Promise<void>
  delete(professor: Professor): Promise<void>
}
