import type { ProjectCommentsRepository } from '@/domain/deck/application/repositories/project-comments-repository.ts'
import type { ProjectComment } from '@/domain/deck/enterprise/entities/project-comment.ts'

export class InMemoryProjectCommentsRepository
  implements ProjectCommentsRepository
{
  public items: ProjectComment[] = []

  async findManyByProjectId(projectId: string): Promise<ProjectComment[]> {
    return this.items.filter(item => item.projectId.toString() === projectId)
  }

  async create(projectComment: ProjectComment): Promise<void> {
    await Promise.resolve(this.items.push(projectComment))
  }

  async delete(projectComment: ProjectComment): Promise<void> {
    const index = this.items.findIndex(item =>
      item.id.equals(projectComment.id),
    )

    if (index !== -1) {
      this.items.splice(index, 1)
    }

    return await Promise.resolve()
  }

  async deleteMany(projectComments: ProjectComment[]): Promise<void> {
    for (const projectComment of projectComments) {
      const index = this.items.findIndex(item =>
        item.id.equals(projectComment.id),
      )

      if (index !== -1) {
        this.items.splice(index, 1)
      }
    }

    return await Promise.resolve()
  }
}
