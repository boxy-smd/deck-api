import type { ProjectTrailsRepository } from '@/domain/deck/application/repositories/project-trails-repository.ts'
import type { ProjectTrail } from '@/domain/deck/enterprise/entities/project-trail.ts'

export class InMemoryProjectTrailsRepository
  implements ProjectTrailsRepository
{
  public items: ProjectTrail[] = []

  async findManyByProjectId(projectId: string): Promise<ProjectTrail[]> {
    return this.items.filter(item => item.projectId.toString() === projectId)
  }

  async create(projectTrail: ProjectTrail): Promise<void> {
    await Promise.resolve(this.items.push(projectTrail))
  }

  async delete(projectTrail: ProjectTrail): Promise<void> {
    const index = this.items.findIndex(item => item.id.equals(projectTrail.id))

    if (index !== -1) {
      this.items.splice(index, 1)
    }

    return await Promise.resolve()
  }

  async createMany(projectTrails: ProjectTrail[]): Promise<void> {
    await Promise.resolve(this.items.push(...projectTrails))
  }

  async deleteMany(projectTrails: ProjectTrail[]): Promise<void> {
    for (const projectTrail of projectTrails) {
      const index = this.items.findIndex(item =>
        item.id.equals(projectTrail.id),
      )

      if (index !== -1) {
        this.items.splice(index, 1)
      }
    }

    return await Promise.resolve()
  }
}
