import type { CommentsRepository } from '@/domain/deck/application/repositories/comments-repository.ts'
import type { Comment } from '@/domain/deck/enterprise/entities/comment.entity.ts'

export class InMemoryCommentsRepository implements CommentsRepository {
  private items: Comment[] = []

  async create(comment: Comment): Promise<void> {
    await Promise.resolve(this.items.push(comment))
  }

  async findById(id: string): Promise<Comment | null> {
    return Promise.resolve(
      this.items.find(item => item.id.toString() === id) || null,
    )
  }

  async save(comment: Comment): Promise<void> {
    const index = this.items.findIndex(item => item.id.equals(comment.id))

    if (index !== -1) {
      this.items[index] = comment
    }

    return await Promise.resolve()
  }

  async delete(comment: Comment): Promise<void> {
    const index = this.items.findIndex(item => item.id.equals(comment.id))

    if (index !== -1) {
      this.items.splice(index, 1)
    }

    return await Promise.resolve()
  }
}
