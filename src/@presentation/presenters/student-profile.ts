import type { User } from '@/@core/domain/authentication/enterprise/entities/user'
import type { StudentProfileWithDetails } from '@/@core/domain/authentication/enterprise/value-objects/student-profile-with-details'

// biome-ignore lint/complexity/noStaticOnlyClass: This class is a presenter and should be static
export class StudentProfilePresenter {
  static toHTTP(student: User | StudentProfileWithDetails) {
    // Check if it's a StudentProfileWithDetails
    const isProfileWithDetails = 'trails' in student && 'posts' in student

    if (isProfileWithDetails) {
      const profile = student as StudentProfileWithDetails
      return {
        id: profile.id,
        name: profile.name,
        username: profile.username,
        about: profile.about,
        semester: profile.semester,
        profileUrl: profile.profileUrl || '',
        trails: profile.trails,
        posts: profile.posts.map(post => ({
          id: post.id.toString(),
          title: post.title,
          description: post.description,
          bannerUrl: post.bannerUrl,
          content: post.content || '',
          publishedYear: post.publishedYear,
          semester: post.semester,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          subject: post.subjectId?.toString() || '',
          trails: Array.from(post.trails).map(t => t.toString()),
          professors: Array.from(post.professors).map(p => p.toString()),
        })),
      }
    }

    // Fallback to regular User
    return {
      id: student.id.toString(),
      name: student.name,
      username: student.username.value,
      about: student.about,
      semester: student.profile?.semester.value || 1,
      profileUrl: student.profileUrl || '',
      trails: [],
      posts: [],
    }
  }
}
