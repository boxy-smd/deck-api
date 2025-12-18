import type { Project } from '@/@core/domain/projects/entities/project'

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
      professorsIds: Array.from(project.professors || []).map(professor => professor.toString()),
    }
  }
}
