import type { Project } from '@/domain/projects/enterprise/entities/project.ts'

//Este presenter é usado para apresentar projetos na lista (posts)
// biome-ignore lint/complexity/noStaticOnlyClass: This class is a presenter and should be static
export class PostPresenter {
  static toHTTP(
    post: Project & {
      // biome-ignore lint/suspicious/noExplicitAny: Temporary until presenters are refactored
      author?: any
      // biome-ignore lint/suspicious/noExplicitAny: Temporary until presenters are refactored
      subject?: any
      // biome-ignore lint/suspicious/noExplicitAny: Temporary until presenters are refactored
      trails?: any
      // biome-ignore lint/suspicious/noExplicitAny: Temporary until presenters are refactored
      professors?: any
    },
  ) {
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
