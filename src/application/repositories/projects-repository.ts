import type { Project, ProjectProps } from '@/domain/entities/project.entity.ts'

export type UpdateProjectRequest = Partial<
  Omit<ProjectProps, 'createdAt' | 'updatedAt' | 'authorId'>
>

export interface ProjectsRepository {
  create(project: Project): Promise<Project>
  findById(id: string): Promise<Project | null>
  findByName(name: string): Promise<Project[]>
  findByAuthorId(authorId: string): Promise<Project[]>
  findBySubjectId(subjectId: string): Promise<Project[]>
  findByProfessorId(professorId: string): Promise<Project[]>
  findByPublishedYear(publishedYear: number): Promise<Project[]>
  update(id: string, request: UpdateProjectRequest): Promise<Project | null>
  delete(id: string): Promise<void>
}
