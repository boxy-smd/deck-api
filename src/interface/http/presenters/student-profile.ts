import type { StudentProfile } from '@/domain/deck/enterprise/entities/value-objects/student-profile.ts'

// biome-ignore lint/complexity/noStaticOnlyClass: This class is a presenter and should be static
export class StudentProfilePresenter {
  static toHTTP(student: StudentProfile) {
    return {
      id: student.id.toString(),
      name: student.name,
      username: student.username,
      about: student.about,
      semester: student.semester,
      profileUrl: student.profileUrl || '',
      trails: student.trails,
      posts: student.posts.map(post => ({
        id: post.id.toString(),
        title: post.title,
        description: post.description,
        bannerUrl: post.bannerUrl,
        content: post.content,
        publishedYear: post.publishedYear,
        semester: post.semester,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        subject: post.subject,
        trails: post.trails,
        professors: post.professors,
      })),
      drafts: student.drafts.map(draft => ({
        id: draft.id.toString(),
        title: draft.title,
        description: draft.description,
        bannerUrl: draft.bannerUrl,
        content: draft.content,
        publishedYear: draft.publishedYear,
        semester: draft.semester,
        createdAt: draft.createdAt,
        updatedAt: draft.updatedAt,
        subjectId: draft.subjectId,
        trailsIds: draft.trails?.map(trail => trail.id.toString()),
        professorsIds: draft.professors?.map(professor =>
          professor.id.toString(),
        ),
      })),
    }
  }
}
