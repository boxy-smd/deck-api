import type { UsersRepository } from '@/domain/authentication/application/repositories/users-repository'
import type { CommentsRepository } from '@/domain/interaction/application/repositories/comments-repository'
import type { Comment } from '@/domain/interaction/enterprise/entities/comment'
import type { CommentWithAuthor } from '@/domain/interaction/enterprise/entities/value-objects/comment-with-author'
import { InMemoryUsersRepository } from './users-repository'

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
          id: comment.id,
          content: comment.content,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          projectId: comment.projectId,
          authorId: comment.authorId,
          author: {
            name: author.name,
            username: author.username.value,
            profileUrl: author.profileUrl || null,
          },
          authorName: author.name,
          authorUsername: author.username.value,
          authorProfileUrl: author.profileUrl || null,
          commentId: comment.id,
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

  async deleteById(id: string): Promise<void> {
    const index = this.items.findIndex(item => item.id.toString() === id)

    if (index === -1) {
      throw new Error('Comment not found.')
    }

    this.items.splice(index, 1)
  }

  async existsById(id: string): Promise<boolean> {
    const index = this.items.findIndex(item => item.id.toString() === id)
    return await Promise.resolve(index !== -1)
  }
}
