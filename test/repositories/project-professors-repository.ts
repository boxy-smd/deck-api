import type { ProjectProfessorsRepository } from '@/domain/deck/application/repositories/project-professors-repository.ts'
import type { ProjectProfessor } from '@/domain/deck/enterprise/entities/project-professor.ts'

export class InMemoryProjectProfessorsRepository
  implements ProjectProfessorsRepository
{
  public items: ProjectProfessor[] = []

  async findManyByProjectId(projectId: string): Promise<ProjectProfessor[]> {
    return this.items.filter(item => item.projectId.toString() === projectId)
  }

  async create(projectProfessor: ProjectProfessor): Promise<void> {
    await Promise.resolve(this.items.push(projectProfessor))
  }

  async delete(projectProfessor: ProjectProfessor): Promise<void> {
    const index = this.items.findIndex(item =>
      item.id.equals(projectProfessor.id),
    )

    if (index !== -1) {
      this.items.splice(index, 1)
    }

    return await Promise.resolve()
  }

  async createMany(projectProfessors: ProjectProfessor[]): Promise<void> {
    await Promise.resolve(this.items.push(...projectProfessors))
  }

  async deleteMany(projectProfessors: ProjectProfessor[]): Promise<void> {
    for (const projectProfessor of projectProfessors) {
      const index = this.items.findIndex(item =>
        item.id.equals(projectProfessor.id),
      )

      if (index !== -1) {
        this.items.splice(index, 1)
      }
    }

    return await Promise.resolve()
  }
}
