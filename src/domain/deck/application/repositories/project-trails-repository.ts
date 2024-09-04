import type { ProjectTrail } from '../../enterprise/entities/project-trail.ts'

export interface ProjectTrailsRepository {
  findManyByProjectId(projectId: string): Promise<ProjectTrail[]>
  create(projectTrail: ProjectTrail): Promise<void>
  delete(projectTrail: ProjectTrail): Promise<void>
  createMany(projectTrails: ProjectTrail[]): Promise<void>
  deleteMany(projectTrails: ProjectTrail[]): Promise<void>
}
