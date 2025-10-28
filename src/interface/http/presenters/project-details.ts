import type { Project } from '@/domain/projects/enterprise/entities/project.ts'

// Este presenter é usado para apresentar detalhes completos de um projeto
// biome-ignore lint/complexity/noStaticOnlyClass: This class is a presenter and should be static
export class ProjectDetailsPresenter {
  static toHTTP(
    details: Project & {
      // biome-ignore lint/suspicious/noExplicitAny: Temporary until presenters are refactored
      author?: any
      // biome-ignore lint/suspicious/noExplicitAny: Temporary until presenters are refactored
      subject?: any
      // biome-ignore lint/suspicious/noExplicitAny: Temporary until presenters are refactored
      trails?: any
      // biome-ignore lint/suspicious/noExplicitAny: Temporary until presenters are refactored
      professors?: any
      // biome-ignore lint/suspicious/noExplicitAny: Temporary until presenters are refactored
      comments?: any
    },
  ) {
    return {
      id: details.id.toString(),
      title: details.title,
      description: details.description,
      bannerUrl: details.bannerUrl,
      content: details.content,
      publishedYear: details.publishedYear,
      status: details.status,
      semester: details.semester,
      allowComments: details.allowComments,
      createdAt: details.createdAt,
      updatedAt: details.updatedAt,
      authorId: details.authorId.toString(),
      author: details.author,
      subjectId: details.subjectId?.toString(),
      subject: details.subject,
      trails: details.trails,
      professors: details.professors,
      comments: details.comments ?? [],
    }
  }
}
