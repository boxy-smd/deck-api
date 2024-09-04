import type {
  ProjectQuery,
  ProjectsRepository,
} from '@/domain/deck/application/repositories/projects-repository.ts'
import type { Project } from '@/domain/deck/enterprise/entities/project.entity.ts'

export class InMemoryProjectsRepository implements ProjectsRepository {
  private items: Project[] = []

  async create(project: Project): Promise<void> {
    await Promise.resolve(this.items.push(project))
  }

  async findById(id: string): Promise<Project | null> {
    return Promise.resolve(
      this.items.find(item => item.id.toString() === id) || null,
    )
  }

  async fetchAll(): Promise<Project[]> {
    return await Promise.resolve(this.items)
  }

  async fetchByQuery({
    title,
    subjectId,
    authorId,
    professorsIds,
    publishedYear,
  }: ProjectQuery): Promise<Project[]> {
    return await Promise.resolve(
      this.items.filter(item => {
        if (title && !item.title.toLowerCase().includes(title.toLowerCase())) {
          return false
        }

        if (subjectId && !(item.subjectId?.toString() === subjectId)) {
          return false
        }

        if (authorId && !(item.authorId.toString() === authorId)) {
          return false
        }

        if (
          professorsIds &&
          item.professors &&
          !item.professors.some(professor =>
            professorsIds.includes(professor.id.toString()),
          )
        ) {
          return false
        }

        if (publishedYear && item.publishedYear !== publishedYear) {
          return false
        }

        return true
      }),
    )
  }

  async save(project: Project): Promise<void> {
    const index = this.items.findIndex(item => item.id.equals(project.id))

    if (index !== -1) {
      this.items[index] = project
    }

    return await Promise.resolve()
  }

  async delete(project: Project): Promise<void> {
    const index = this.items.findIndex(item => item.id.equals(project.id))

    if (index !== -1) {
      this.items.splice(index, 1)
    }

    return await Promise.resolve()
  }
}
