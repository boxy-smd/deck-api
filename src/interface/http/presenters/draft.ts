import type { Project } from '@/domain/projects/enterprise/entities/project'

// biome-ignore lint/complexity/noStaticOnlyClass: This class is a presenter and should be static
export class DraftPresenter {
  static toHTTP(draft: Project) {
    return {
      id: draft.id.toString(),
      title: draft.title,
      description: draft.description,
      bannerUrl: draft.bannerUrl,
      content: draft.content,
      publishedYear: draft.publishedYear,
      semester: draft.semester,
      allowComments: draft.allowComments,
      status: draft.status,
      authorId: draft.authorId.toString(),
      subjectId: draft.subjectId?.toString(),
      trailsIds: Array.from(draft.trails).map(trailId => trailId.toString()),
      professorsIds: Array.from(draft.professors).map(professorId =>
        professorId.toString(),
      ),
    }
  }
}
