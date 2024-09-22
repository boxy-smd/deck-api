import type { Draft } from '@/domain/deck/enterprise/entities/draft.ts'

// biome-ignore lint/complexity/noStaticOnlyClass: This class is a presenter and should be static
export class DraftPresenter {
  static toHTTP(draft: Draft) {
    return {
      id: draft.id.toString(),
      title: draft.title,
      description: draft.description,
      bannerUrl: draft.bannerUrl,
      content: draft.content,
      publishedYear: draft.publishedYear,
      semester: draft.semester,
      allowComments: draft.allowComments,
      authorId: draft.authorId.toString(),
      subjectId: draft.subjectId?.toString(),
      trailsIds: draft.trails?.map(trail => trail.id.toString()),
      professorsIds: draft.professors?.map(professor =>
        professor.id.toString(),
      ),
    }
  }
}
