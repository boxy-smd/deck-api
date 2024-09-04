import { Entity } from '@/core/entities/entity.ts'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'

export interface StudentTrailProps {
  studentId: UniqueEntityID
  trailId: UniqueEntityID
}

export class StudentTrail extends Entity<StudentTrailProps> {
  get studentId() {
    return this.props.studentId
  }

  get trailId() {
    return this.props.trailId
  }

  static create(props: StudentTrailProps, id?: UniqueEntityID): StudentTrail {
    return new StudentTrail(props, id)
  }
}
