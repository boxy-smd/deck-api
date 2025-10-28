import type { Project } from '@/domain/projects/enterprise/entities/project.ts'

// Este presenter é usado para apresentar detalhes completos de um projeto
// biome-ignore lint/complexity/noStaticOnlyClass: This class is a presenter and should be static
export class ProjectDetailsPresenter {
  static toHTTP(project: Project) {
    const details = project as any
    return {
      id: project.id.toString(),
      title: project.title,
      description: project.description,
      bannerUrl: project.bannerUrl,
      content: project.content,
      publishedYear: project.publishedYear,
      status: project.status,
      semester: project.semester,
      allowComments: project.allowComments,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      authorId: project.authorId.toString(),
      author: details.__author,
      subjectId: project.subjectId?.toString(),
      subject: details.__subject,
      trails: details.__trails || [],
      professors: details.__professors || [],
      comments: details.__comments || [],
    }
  }
}
