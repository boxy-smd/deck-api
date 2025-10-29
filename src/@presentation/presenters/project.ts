import type { Project } from '@/@core/domain/projects/enterprise/entities/project'

// biome-ignore lint/complexity/noStaticOnlyClass: This class is a presenter and should be static
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
      trailsIds: project.trails.map(trail => trail.toString()),
      professorsIds: project.professors?.map(professor => professor.toString()),
    }
  }
}
