import type { CommentsRepository } from '@/domain/deck/application/repositories/comments-repository.ts'
import type { Comment } from '@/domain/deck/enterprise/entities/comment.ts'

export class InMemoryCommentsRepository implements CommentsRepository {
  public items: Comment[] = []

  async create(comment: Comment): Promise<void> {
    await Promise.resolve(this.items.push(comment))
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
