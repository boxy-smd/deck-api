import type {
  Professor,
  ProfessorProps,
} from '@/domain/deck/enterprise/entities/professor.ts'

export interface ProfessorsRepository {
  findById(id: string): Promise<Professor | null>
  findManyByName(name: string): Promise<Professor[]>
  findAll(): Promise<Professor[]>
  create(professor: ProfessorProps): Promise<void>
  save(professor: Professor): Promise<void>
}
