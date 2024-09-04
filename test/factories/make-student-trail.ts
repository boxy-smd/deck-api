import { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import {
  StudentTrail,
  type StudentTrailProps,
} from '@/domain/deck/enterprise/entities/student-trail.ts'

export function makeStudentTrail(
  override: Partial<StudentTrailProps> = {},
  id?: UniqueEntityID,
) {
  const studentTrail = StudentTrail.create(
    {
      studentId: new UniqueEntityID(),
      trailId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return studentTrail
}
