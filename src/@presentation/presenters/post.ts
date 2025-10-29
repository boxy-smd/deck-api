import type { Post } from '@/@core/domain/projects/enterprise/value-objects/post'

// biome-ignore lint/complexity/noStaticOnlyClass: This class is a presenter and should be static
export class PostPresenter {
  static toHTTP(post: Post) {
    return {
      id: post.id.toString(),
      title: post.title,
      description: post.description,
      bannerUrl: post.bannerUrl,
      content: post.content,
      publishedYear: post.publishedYear,
      status: post.status,
      semester: post.semester,
      authorId: post.authorId.toString(),
      author: post.author,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      subjectId: post.subjectId?.toString(),
      subject: post.subject,
      trails: post.trails,
      professors: post.professors,
    }
  }
}
