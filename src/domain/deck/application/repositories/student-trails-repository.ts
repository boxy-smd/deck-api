import type { StudentTrail } from '../../enterprise/entities/student-trail.ts'

export interface StudentTrailsRepository {
  findManyByStudentId(studentId: string): Promise<StudentTrail[]>
}
