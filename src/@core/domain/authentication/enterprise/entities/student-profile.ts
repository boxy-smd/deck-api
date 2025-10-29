import type { Trail } from '@/@core/domain/projects/enterprise/entities/trail'
import { Entity } from '@/@shared/kernel/kernel/entity'
import type { UniqueEntityID } from '@/@shared/kernel/kernel/unique-entity-id'
import type { Optional } from '@/@shared/kernel/types/optional'
import type { Semester } from '../value-objects/semester'

export interface StudentProfileProps {
  semester: Semester

  trailsIds: Set<UniqueEntityID<Trail>>
}

export class StudentProfile extends Entity<StudentProfileProps> {
  static create(
    props: Optional<StudentProfileProps, 'trailsIds'>,
    studentId: UniqueEntityID,
  ) {
    return new StudentProfile(
      {
        ...props,
        trailsIds: new Set(),
      },
      studentId,
    )
  }

  static reconstitute(
    props: StudentProfileProps,
    studentId: UniqueEntityID,
    createdAt: Date,
    updatedAt: Date,
  ) {
    return new StudentProfile(props, studentId, createdAt, updatedAt)
  }

  public updateSemester(semester: Semester) {
    this.props.semester = semester
  }

  public addTrail(trailId: UniqueEntityID<Trail>) {
    this.props.trailsIds.add(trailId)
  }

  public removeTrail(trailId: UniqueEntityID<Trail>) {
    this.props.trailsIds.delete(trailId)
  }

  // --- 3. Getters ---
  get semester() {
    return this.props.semester
  }

  get trailsIds() {
    // Return a copy to prevent external mutation
    return [...this.props.trailsIds]
  }
}
