import type { Project } from '@/@core/domain/projects/entities/project'
import type { DomainRepository } from '@/@shared/kernel/kernel/domain-repository'
import type { ProjectDTO } from '../dtos/project.dto'

export type ProjectQuery = {
  trailsIds?: string[]
  semester?: number
  subjectId?: string
  publishedYear?: number
}

export interface ProjectsRepository extends DomainRepository<Project> {
  findByIdWithDetails(id: string): Promise<ProjectDTO | null>

  findManyByTitle(title: string): Promise<Project[]>

  findManyProjectDTOsByTitle(title: string): Promise<ProjectDTO[]>

  findManyByProfessorName(name: string): Promise<Project[]>

  findManyProjectDTOsByProfessorName(name: string): Promise<ProjectDTO[]>

  findManyByQuery(query: ProjectQuery): Promise<Project[]>

  findManyProjectDTOsByQuery(query: ProjectQuery): Promise<ProjectDTO[]>

  findManyByTag(tag: string): Promise<Project[]>

  findManyProjectDTOsByTag(tag: string): Promise<ProjectDTO[]>

  findManyByStudentId(studentId: string): Promise<Project[]>

  findManyProjectDTOsByStudentId(studentId: string): Promise<ProjectDTO[]>

  findAllProjectDTOs(): Promise<ProjectDTO[]>
}
