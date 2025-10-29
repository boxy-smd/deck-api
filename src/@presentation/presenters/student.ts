import type { User } from '@/@core/domain/authentication/enterprise/entities/user'

// biome-ignore lint/complexity/noStaticOnlyClass: This class is a presenter and should be static
export class StudentPresenter {
  static toHTTP(student: User) {
    return {
      id: student.id.toString(),
      name: student.name,
      username: student.username.value,
      semester: student.profile?.semester.value || 1,
      profileUrl: student.profileUrl || '',
      trails: student.profile?.trailsIds 
        ? Array.from(student.profile.trailsIds).map(id => id.toString())
        : [],
    }
  }
}
