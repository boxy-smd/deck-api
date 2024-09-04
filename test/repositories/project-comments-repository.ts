import { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import type { ProjectCommentsRepository } from '@/domain/deck/application/repositories/project-comments-repository.ts'
import type { ProjectComment } from '@/domain/deck/enterprise/entities/project-comment.ts'
import { CommentWithAuthor } from '@/domain/deck/enterprise/entities/value-objects/comment-with-autor.ts'
import type { InMemoryStudentsRepository } from './students-repository.ts'

export class InMemoryProjectCommentsRepository
  implements ProjectCommentsRepository
{
  public items: ProjectComment[] = []

  constructor(private studentsRepository: InMemoryStudentsRepository) {}

  async findById(id: string): Promise<ProjectComment | null> {
    const projectComment = this.items.find(item =>
      item.id.equals(new UniqueEntityID(id)),
    )

    return await Promise.resolve(projectComment || null)
  }

  async findManyByProjectIdWitAuthor(
    projectId: string,
  ): Promise<CommentWithAuthor[]> {
    const projectComments = this.items
      .filter(item => item.projectId.equals(new UniqueEntityID(projectId)))
      .map(comment => {
        const author = this.studentsRepository.items.find(student =>
          student.id.equals(comment.authorId),
        )

        if (!author) {
          throw new Error(`Author with ID ${comment.authorId} not found.`)
        }

        return CommentWithAuthor.create({
          content: comment.content,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt || undefined,
          author: {
            name: author.name,
            username: author.username,
          },
          authorId: comment.authorId,
          commentId: comment.id,
        })
      })

    return await Promise.resolve(projectComments)
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
