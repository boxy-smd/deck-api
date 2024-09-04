import type { StudentTrail } from '../../enterprise/entities/student-trail.ts'

export interface StudentTrailsRepository {
  findManyByStudentId(studentId: string): Promise<StudentTrail[]>
  create(studentTrail: StudentTrail): Promise<void>
  delete(studentTrail: StudentTrail): Promise<void>
  createMany(studentTrails: StudentTrail[]): Promise<void>
}
