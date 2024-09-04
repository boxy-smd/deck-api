import type { StudentTrail } from '../../enterprise/entities/student-trail.entity.ts'

export interface StudentTrailsRepository {
  findManyByStudentId(studentId: string): Promise<StudentTrail[]>
}
