import type { Repository } from '@/domain/core/interfaces/repository.ts'
import type { Subject, SubjectProps } from '@/domain/entities/subject.entity.ts'

export type UpdateSubjectRequest = Partial<
  Omit<SubjectProps, 'createdAt' | 'updatedAt'>
>

export interface SubjectsRepository
  extends Repository<Subject, UpdateSubjectRequest> {
  findByName(name: string): Promise<Subject | null>
  fetchByName(name: string): Promise<Subject[]>
}
