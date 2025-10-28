import type { CommentsRepository } from '@/domain/interaction/application/repositories/comments-repository.ts'
import type { UsersRepository } from '@/domain/authentication/application/repositories/users-repository.ts'
import { Comment } from '@/domain/interaction/enterprise/entities/comment.ts'
import type { CommentWithAuthor } from '@/domain/interaction/enterprise/entities/value-objects/comment-with-author.ts'
import type { UniqueEntityID } from '@/shared/kernel/unique-entity-id.ts'
import { InMemoryUsersRepository } from './users-repository.ts'

export class InMemoryCommentsRepository implements CommentsRepository {
  public items: Comment[] = []

  private usersRepository: UsersRepository

  constructor(usersRepository?: UsersRepository) {
    this.usersRepository = usersRepository || new InMemoryUsersRepository()
  }

  async findById(id: string): Promise<Comment | null> {
    return Promise.resolve(
      this.items.find(item => item.id.toString() === id) || null,
    )
  }

  async findByProjectId(projectId: string): Promise<Comment[]> {
    const comments = this.items.filter(
      item => item.projectId.toString() === projectId,
    )

    return await Promise.all(comments)
  }

  async findManyByProjectIdWithAuthors(
    projectId: string,
  ): Promise<CommentWithAuthor[]> {
    const comments = await this.findByProjectId(projectId)

    const commentsWithAuthors = await Promise.all(
      comments.map(async comment => {
        const author = await this.usersRepository.findById(
          comment.authorId.toString(),
        )

        if (!author) {
          throw new Error('Author not found.')
        }

        return {
          id: comment.id.toString(),
          content: comment.content,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          projectId: comment.projectId.toString(),
          authorId: comment.authorId.toString(),
          author: {
            name: author.name,
            username: author.username,
            profileUrl: author.profileUrl || null,
          },
        } as CommentWithAuthor
      }),
    )

    return commentsWithAuthors
  }

  async deleteManyByProjectId(projectId: string): Promise<void> {
    this.items = this.items.filter(
      item => item.projectId.toString() !== projectId,
    )
  }

  async findAll(): Promise<Comment[]> {
    return await Promise.resolve(this.items)
  }

  async create(comment: Comment): Promise<void> {
    await Promise.resolve(this.items.push(comment))
  }

  async save(comment: Comment): Promise<void> {
    const index = this.items.findIndex(item => item.id.equals(comment.id))

    if (index === -1) {
      throw new Error('Comment not found.')
    }

    this.items[index] = comment
  }

  async delete(comment: Comment): Promise<void> {
    const index = this.items.findIndex(item => item.id.equals(comment.id))

    if (index === -1) {
      throw new Error('Comment not found.')
    }

    this.items.splice(index, 1)
  }

  async deleteById(id: UniqueEntityID): Promise<void> {
    const index = this.items.findIndex(item => item.id.equals(id))

    if (index === -1) {
      throw new Error('Comment not found.')
    }

    this.items.splice(index, 1)
  }

  async existsById(id: UniqueEntityID): Promise<boolean> {
    const index = this.items.findIndex(item => item.id.equals(id))
    return await Promise.resolve(index !== -1)
  }
}
