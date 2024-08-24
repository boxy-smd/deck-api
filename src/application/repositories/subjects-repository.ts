import type { Subject, SubjectProps } from '@/domain/entities/subject.entity.ts'

export type UpdateSubjectRequest = Partial<
  Omit<SubjectProps, 'createdAt' | 'updatedAt'>
>

export interface SubjectsRepository {
  create(subject: Subject): Promise<Subject>
  findById(id: string): Promise<Subject | null>
  fetchByName(name: string): Promise<Subject[]>
  findByCode(code: string): Promise<Subject | null>
  update(id: string, request: UpdateSubjectRequest): Promise<Subject | null>
  delete(id: string): Promise<void>
}
