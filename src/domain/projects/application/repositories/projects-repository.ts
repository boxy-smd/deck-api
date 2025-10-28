import type { Project } from '@/domain/projects/enterprise/entities/project.ts'
import type { DomainRepository } from '@/shared/kernel/domain-repository.ts'

export type ProjectQuery = {
  trailsIds?: string[]
  semester?: number
  subjectId?: string
  publishedYear?: number
}

export interface ProjectsRepository extends DomainRepository<Project> {
  findManyByTitle(title: string): Promise<Project[]>

  findManyByProfessorName(name: string): Promise<Project[]>

  findManyByQuery(query: ProjectQuery): Promise<Project[]>

  findManyByTag(tag: string): Promise<Project[]>

  findManyByStudentId(studentId: string): Promise<Project[]>
}
