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
      profileUrl: student.profileUrl,
      trails: student.trails,
      projects: student.projects.map(project => ({
        id: project.authorId.toString(),
        title: project.title,
        description: project.description,
        bannerUrl: project.bannerUrl,
        content: project.content,
        publishedYear: project.publishedYear,
        semester: project.semester,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        subject: project.subject,
        trails: project.trails,
        professors: project.professors,
      })),
    }
  }
}
