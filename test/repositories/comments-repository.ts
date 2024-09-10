import type { CommentsRepository } from '@/domain/deck/application/repositories/comments-repository.ts'
import type { StudentsRepository } from '@/domain/deck/application/repositories/students-repository.ts'
import type { Comment } from '@/domain/deck/enterprise/entities/comment.ts'
import { CommentWithAuthor } from '@/domain/deck/enterprise/entities/value-objects/comment-with-author.ts'

export class InMemoryCommentsRepository implements CommentsRepository {
  public items: Comment[] = []

  constructor(private studentsRepository: StudentsRepository) {}

  async findById(id: string): Promise<Comment | null> {
    return Promise.resolve(
      this.items.find(item => item.id.toString() === id) || null,
    )
  }

  async findManyByProjectIdWithAuthors(
    projectId: string,
  ): Promise<CommentWithAuthor[]> {
    const comments = this.items.filter(
      item => item.projectId.toString() === projectId,
    )

    const commentsWithAuthors = await Promise.all(
      comments.map(async comment => {
        const author = await this.studentsRepository.findById(
          comment.authorId.toString(),
        )

        if (!author) {
          throw new Error('Author not found.')
        }

        return CommentWithAuthor.create({
          id: comment.id,
          content: comment.content,
          author: {
            name: author.name,
            username: author.username,
            profileUrl: author.profileUrl,
          },
          authorId: author.id,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt || undefined,
        })
      }),
    )

    return await Promise.resolve(commentsWithAuthors)
  }

  async create(comment: Comment): Promise<void> {
    this.items.push(comment)

    return await Promise.resolve()
  }

  async save(comment: Comment): Promise<void> {
    const index = this.items.findIndex(item => item.id.equals(comment.id))

    if (index !== -1) {
      this.items[index] = comment
    }

    return await Promise.resolve()
  }

  async delete(id: string): Promise<void> {
    const index = this.items.findIndex(item => item.id.toString() === id)

    if (index === -1) {
      throw new Error('Comment not found.')
    }

    this.items.splice(index, 1)
  }

  async deleteManyByProjectId(projectId: string): Promise<void> {
    this.items = this.items.filter(
      item => item.projectId.toString() !== projectId,
    )

    return await Promise.resolve()
  }
}
