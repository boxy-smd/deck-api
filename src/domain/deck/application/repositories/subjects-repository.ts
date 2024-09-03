import type { Subject } from '../../enterprise/entities/subject.entity.ts'

export interface SubjectsRepository {
  findById(id: string): Promise<Subject | null>
  findByName(name: string): Promise<Subject | null>
  fetchAll(): Promise<Subject[]>
  fetchByName(name: string): Promise<Subject[]>
  create(subject: Subject): Promise<void>
  save(subject: Subject): Promise<void>
}
