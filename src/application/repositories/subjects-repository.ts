import type { Repository } from '@/domain/core/interfaces/repository.ts'
import type { Subject, SubjectProps } from '@/domain/entities/subject.entity.ts'

export type UpdateSubjectRequest = Partial<Pick<SubjectProps, 'name'>>

export interface SubjectsRepository
  extends Repository<Subject, UpdateSubjectRequest> {
  fetch(): Promise<Subject[]>
  findByName(name: string): Promise<Subject | null>
  fetchByName(name: string): Promise<Subject[]>
}
