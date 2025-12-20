import type { ProjectSummaryDTO } from '@/@core/application/projects/dtos/project-summary.dto'
import type { ProjectDTO } from '@/@core/application/projects/dtos/project.dto'
import type { Project } from '@/@core/domain/projects/entities/project'
import { CommentPresenter } from '@/@presentation/presenters/comment'

export class ProjectPresenter {
  static toHTTP(project: Project) {
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
      authorId: project.authorId.toString(),
      subjectId: project.subjectId?.toString(),
      trailsIds: Array.from(project.trails).map(trail => trail.toString()),
      professorsIds: Array.from(project.professors || []).map(professor =>
        professor.toString(),
      ),
    }
  }

  static summaryToHTTP(project: ProjectSummaryDTO) {
    return {
      id: project.id,
      title: project.title,
      description: project.description,
      bannerUrl: project.bannerUrl || undefined,
      publishedYear: project.publishedYear || 0,
      semester: project.semester || 0,
      allowComments: project.allowComments,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt || undefined,
      author: {
        id: project.author.id,
        name: project.author.name,
        username: project.author.username,
        profileUrl: project.author.profileUrl || undefined,
      },
      subject: project.subject || undefined,
      trails: project.trails,
      professors: project.professors,
    }
  }

  static detailsToHTTP(project: ProjectDTO) {
    return {
      id: project.id,
      title: project.title,
      description: project.description,
      bannerUrl: project.bannerUrl || undefined,
      content: project.content || '',
      publishedYear: project.publishedYear || 0,
      semester: project.semester || 0,
      allowComments: project.allowComments,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt || undefined,
      author: {
        id: project.author.id,
        name: project.author.name,
        username: project.author.username,
        profileUrl: project.author.profileUrl || undefined,
      },
      subject: project.subject || undefined,
      trails: project.trails,
      professors: project.professors,
      comments: project.comments.map(CommentPresenter.toHTTP),
    }
  }
}
