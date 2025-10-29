import type { Project } from '@/domain/projects/enterprise/entities/project'
import type { DomainRepository } from '@/shared/kernel/domain-repository'
import type { Post } from '../../enterprise/value-objects/post'

export type ProjectQuery = {
  trailsIds?: string[]
  semester?: number
  subjectId?: string
  publishedYear?: number
}

export interface ProjectsRepository extends DomainRepository<Project> {
  findManyByTitle(title: string): Promise<Project[]>

  findManyPostsByTitle(title: string): Promise<Post[]>

  findManyByProfessorName(name: string): Promise<Project[]>

  findManyPostsByProfessorName(name: string): Promise<Post[]>

  findManyByQuery(query: ProjectQuery): Promise<Project[]>

  findManyPostsByQuery(query: ProjectQuery): Promise<Post[]>

  findManyByTag(tag: string): Promise<Project[]>

  findManyPostsByTag(tag: string): Promise<Post[]>

  findManyByStudentId(studentId: string): Promise<Project[]>

  findAllPosts(): Promise<Post[]>
}
