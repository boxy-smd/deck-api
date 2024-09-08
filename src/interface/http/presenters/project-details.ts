import type { ProjectDetails } from '@/domain/deck/enterprise/entities/value-objects/project-details.ts'

// biome-ignore lint/complexity/noStaticOnlyClass: This class is a presenter and should be static
export class ProjectDetailsPresenter {
  static toHTTP(details: ProjectDetails) {
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
      authorId: details.authorId.toString(),
      author: {
        name: details.author.name,
        username: details.author.username,
        profileUrl: details.author.profileUrl,
      },
      subjectId: details.subjectId?.toString(),
      subject: details.subject ?? undefined,
      trails: details.trails,
      professors: details.professors,
    }
  }
}
