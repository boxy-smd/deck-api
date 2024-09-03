import type { Comment } from '@/domain/entities/comment.entity.ts'
import type {
  CommentsRepository,
  UpdateCommentRequest,
} from '@/domain/repositories/comments-repository.ts'

export class InMemoryCommentsRepository implements CommentsRepository {
  private comments: Comment[] = []

  async create(comment: Comment): Promise<Comment> {
    this.comments.push(comment)
    return await Promise.resolve(comment)
  }

  async findById(id: string): Promise<Comment | null> {
    const comment = this.comments.find(comment => comment.id === id)
    return await Promise.resolve(comment ?? null)
  }

  async fetchByProjectId(projectId: string): Promise<Comment[]> {
    const comments = this.comments.filter(comment => {
      if (comment.projectId !== projectId) return false
      return true
    })

    return await Promise.resolve(comments)
  }

  async update(
    id: string,
    request: UpdateCommentRequest,
  ): Promise<Comment | null> {
    const comment = this.comments.find(comment => comment.id === id)

    if (!comment) return await Promise.resolve(null)

    if (request.content) {
      comment.content = request.content
    }

    return await Promise.resolve(comment)
  }

  async delete(id: string): Promise<void> {
    this.comments = this.comments.filter(comment => comment.id !== id)
    return await Promise.resolve()
  }
}
