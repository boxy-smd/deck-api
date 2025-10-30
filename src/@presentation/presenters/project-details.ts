import type { ProjectDTO } from '@/@core/domain/projects/application/dtos/project.dto'

export class ProjectDetailsPresenter {
  static toHTTP(project: ProjectDTO) {
    return {
      id: project.id,
      title: project.title,
      description: project.description,
      bannerUrl: project.bannerUrl || undefined,
      content: project.content || '',
      publishedYear: project.publishedYear || 0,
      semester: project.semester || 0,
      allowComments: true, // TODO: add allowComments to ProjectDTO
      createdAt: project.createdAt,
      author: {
        id: project.author.id,
        name: project.author.name,
        username: project.author.username,
        profileUrl: project.author.profileUrl || undefined,
      },
      subject: {
        id: project.subject?.id || '',
        name: project.subject?.name || '',
      },
      trails: project.trails.map(t => ({
        id: t.id,
        name: t.name,
      })),
      professors: project.professors.map(p => ({
        id: p.id,
        name: p.name,
      })),
    }
  }
}
