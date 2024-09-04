import type { ProjectProfessor } from '../../enterprise/entities/project-professor.ts'

export interface ProjectProfessorsRepository {
  findManyByProjectId(projectId: string): Promise<ProjectProfessor[]>
  create(projectProfessor: ProjectProfessor): Promise<void>
  delete(projectProfessor: ProjectProfessor): Promise<void>
  createMany(projectProfessors: ProjectProfessor[]): Promise<void>
  deleteMany(projectProfessors: ProjectProfessor[]): Promise<void>
}
