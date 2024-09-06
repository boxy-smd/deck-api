import type { Student } from '@/domain/deck/enterprise/entities/student.ts'

// biome-ignore lint/complexity/noStaticOnlyClass: This class is a presenter and should be static
export class StudentPresenter {
  static toHTTP(student: Student) {
    return {
      id: student.id.toString(),
      name: student.name,
      username: student.username,
      semester: student.semester,
      profileUrl: student.profileUrl || '',
      trailsIds: student.trails.map(trail => trail.id.toString()),
    }
  }
}
