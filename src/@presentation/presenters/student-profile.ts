import type { User } from '@/@core/domain/authentication/enterprise/entities/user'
import type { StudentProfileWithDetails } from '@/@core/domain/authentication/enterprise/value-objects/student-profile-with-details'

export class StudentProfilePresenter {
  static toHTTP(student: User | StudentProfileWithDetails) {
    const isProfileWithDetails = 'trails' in student && 'posts' in student

    if (isProfileWithDetails) {
      const profile = student as StudentProfileWithDetails
      return {
        id: profile.id,
        name: profile.name,
        username: profile.username,
        email: '', // Email não é exposto em profiles públicos
        semester: profile.semester,
        about: profile.about,
        profileUrl: profile.profileUrl || undefined,
        trails: profile.trails.map(t => ({ id: t, name: '' })),
        createdAt: new Date(),
      }
    }

    // Fallback to regular User
    return {
      id: student.id.toString(),
      name: student.name,
      username: student.username.value,
      email: student.email.value,
      semester: student.profile?.semester.value || 1,
      about: student.about,
      profileUrl: student.profileUrl || undefined,
      trails: [],
      createdAt: student.createdAt,
    }
  }
}
