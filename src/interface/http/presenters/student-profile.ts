import type { User } from '@/domain/authentication/enterprise/entities/user.ts'

// biome-ignore lint/complexity/noStaticOnlyClass: This class is a presenter and should be static
export class StudentProfilePresenter {
  static toHTTP(
    student: User & {
      // biome-ignore lint/suspicious/noExplicitAny: Temporary until presenters are refactored
      trails?: any
      // biome-ignore lint/suspicious/noExplicitAny: Temporary until presenters are refactored
      posts?: any
      // biome-ignore lint/suspicious/noExplicitAny: Temporary until presenters are refactored
      drafts?: any
    },
  ) {
    return {
      id: student.id.toString(),
      name: student.name,
      username: student.username.value,
      about: student.about,
      semester: student.profile?.semester.value,
      profileUrl: student.profileUrl || '',
      trails: student.trails || [],
      // biome-ignore lint/suspicious/noExplicitAny: Temporary until presenters are refactored
      posts: (student.posts || []).map((post: any) => ({
        id: post.id.toString(),
        title: post.title,
        description: post.description,
        bannerUrl: post.bannerUrl,
        content: post.content || '',
        publishedYear: post.publishedYear,
        semester: post.semester,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        subject: post.subject,
        trails: post.trails,
        professors: post.professors,
      })),
      // biome-ignore lint/suspicious/noExplicitAny: Temporary until presenters are refactored
      drafts: (student.drafts || []).map((draft: any) => ({
        id: draft.id.toString(),
        title: draft.title,
        description: draft.description,
        bannerUrl: draft.bannerUrl,
        content: draft.content,
        publishedYear: draft.publishedYear,
        semester: draft.semester,
        createdAt: draft.createdAt,
        updatedAt: draft.updatedAt,
        subjectId: draft.subjectId?.toString(),
        // biome-ignore lint/suspicious/noExplicitAny: Temporary until presenters are refactored
        trailsIds: Array.from(draft.trails || []).map((trailId: any) =>
          trailId.toString(),
        ),
        professorsIds: Array.from(draft.professors || []).map(
          // biome-ignore lint/suspicious/noExplicitAny: Temporary until presenters are refactored
          (professorId: any) => professorId.toString(),
        ),
      })),
    }
  }
}
