import type { Subject } from '@/domain/deck/enterprise/entities/subject.ts'

export interface SubjectsRepository {
  findById(id: string): Promise<Subject | null>
  findByName(name: string): Promise<Subject | null>
  findManyByName(name: string): Promise<Subject[]>
  findAll(): Promise<Subject[]>
  create(subject: Subject): Promise<void>
  save(subject: Subject): Promise<void>
}
