import type { Project } from '@/@core/domain/projects/entities/project'
import type { DomainRepository } from '@/@shared/kernel/kernel/domain-repository'
import type { ProjectDTO } from '../dtos/project.dto'

export type ProjectQuery = {
  trailsIds?: string[]
  semester?: number
  subjectId?: string
  publishedYear?: number
}

export abstract class ProjectsRepository implements DomainRepository<Project> {
  abstract findById(id: string): Promise<Project | null>

  abstract findAll(): Promise<Project[]>

  abstract create(entity: Project): Promise<void>

  abstract save(entity: Project): Promise<void>

  abstract delete(entity: Project): Promise<void>

  abstract deleteById(id: string): Promise<void>

  abstract existsById(id: string): Promise<boolean>

  abstract findByIdWithDetails(id: string): Promise<ProjectDTO | null>

  abstract findManyByTitle(title: string): Promise<Project[]>

  abstract findManyProjectDTOsByTitle(title: string): Promise<ProjectDTO[]>

  abstract findManyByProfessorName(name: string): Promise<Project[]>

  abstract findManyProjectDTOsByProfessorName(
    name: string,
  ): Promise<ProjectDTO[]>

  abstract findManyByQuery(query: ProjectQuery): Promise<Project[]>

  abstract findManyProjectDTOsByQuery(
    query: ProjectQuery,
  ): Promise<ProjectDTO[]>

  abstract findManyByTag(tag: string): Promise<Project[]>

  abstract findManyProjectDTOsByTag(tag: string): Promise<ProjectDTO[]>

  abstract findManyByStudentId(studentId: string): Promise<Project[]>

  abstract findManyProjectDTOsByStudentId(
    studentId: string,
  ): Promise<ProjectDTO[]>

  abstract findAllProjectDTOs(): Promise<ProjectDTO[]>

  abstract findDraftsByAuthorId(authorId: string): Promise<Project[]>
}
