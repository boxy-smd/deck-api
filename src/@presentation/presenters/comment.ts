import type { CommentWithAuthor } from '@/@core/domain/interactions/value-objects/comment-with-author'

export class CommentPresenter {
  static toHTTP(comment: CommentWithAuthor) {
    return {
      id: comment.commentId.toString(),
      content: comment.content,
      createdAt: comment.createdAt,
      authorId: comment.authorId.toString(),
      author: {
        id: comment.authorId.toString(),
        name: comment.authorName,
        username: comment.authorUsername,
        profileUrl: comment.authorProfileUrl,
      },
    }
  }
}
