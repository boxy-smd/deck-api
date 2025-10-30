import { Entity } from '@/@shared/kernel/kernel/entity'
import type { UniqueEntityID } from '@/@shared/kernel/kernel/unique-entity-id'
import type { SubjectType } from '../value-objects/subject-type'

export interface SubjectProps {
  code: string
  name: string
  workload: number
  semester: number
  type: SubjectType
}

export class Subject extends Entity<SubjectProps> {
  // --- 1. Factory methods ---
  static create(props: SubjectProps, id?: UniqueEntityID): Subject {
    return new Subject(props, id)
  }

  static reconstitute(
    props: SubjectProps,
    id: UniqueEntityID,
    createdAt: Date,
    updatedAt: Date,
  ): Subject {
    const subject = Object.create(Subject.prototype)
    Object.assign(subject, {
      props,
      _id: id,
      _createdAt: createdAt,
      _updatedAt: updatedAt,
    })
    return subject
  }

  // --- 3. Getters ---
  get name() {
    return this.props.name
  }

  get code() {
    return this.props.code
  }

  get workload() {
    return this.props.workload
  }

  get semester() {
    return this.props.semester
  }

  get type() {
    return this.props.type
  }
}
