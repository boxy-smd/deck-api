import type { Project } from '@/@core/domain/projects/enterprise/entities/project'
import type { ProjectWithMetadata } from '@/@infra/database/prisma/mappers/project-with-metadata'

export class ProjectDetailsPresenter {
  static toHTTP(project: Project & ProjectWithMetadata) {
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
      author: project.metadata?.author,
      subjectId: project.subjectId?.toString(),
      subject: project.metadata?.subject,
      trails: project.metadata?.trails || [],
      professors: project.metadata?.professors || [],
      comments: project.metadata?.comments || [],
    }
  }
}
