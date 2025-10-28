import type { Trail } from '@/domain/projects/enterprise/entities/trail.ts'
import { Entity } from '@/shared/kernel/entity.ts'
import type { UniqueEntityID } from '@/shared/kernel/unique-entity-id.ts'
import type { Optional } from '@/shared/types/optional.ts'
import type { Semester } from '../value-objects/semester.ts'

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
    try {
      this.props.semester.update(semester.value)
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message)
      }

      throw new Error('Ocorreu um erro ao atualizar o semestre.')
    }
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
