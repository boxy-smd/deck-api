import type { CommentWithAuthor } from '@/@core/domain/interaction/enterprise/entities/value-objects/comment-with-author'

export class CommentPresenter {
  static toHTTP(comment: CommentWithAuthor) {
    return {
      id: comment.commentId.toString(),
      content: comment.content,
      created_at: comment.createdAt,
      updated_at: comment.updatedAt,
      project_id: comment.projectId.toString(),
      author: {
        id: comment.authorId.toString(),
        name: comment.authorName,
        username: comment.authorUsername,
        profile_url: comment.authorProfileUrl,
      },
    }
  }
}
