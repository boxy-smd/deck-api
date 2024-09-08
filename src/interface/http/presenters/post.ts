import type { Post } from '@/domain/deck/enterprise/entities/value-objects/post.ts'

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
      author: {
        name: post.author.name,
        username: post.author.username,
        profileUrl: post.author.profileUrl,
      },
      createdAt: post.createdAt,
      updatedAt: post.updatedAt ?? undefined,
      subjectId: post.subjectId?.toString(),
      subject: post.subject ?? undefined,
      trails: post.trails,
      professors: post.professors,
    }
  }
}
