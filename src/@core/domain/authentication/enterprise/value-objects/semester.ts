import { type Either, left, right } from '@/@shared/kernel/either'
import { ValueObject } from '@/@shared/kernel/kernel/value-object'
import { SemesterOutOfBoundsError } from '../../application/errors/semester-out-of-bounds.error'

interface SemesterProps {
  value: number
}

export class Semester extends ValueObject<SemesterProps> {
  private static readonly MIN_SEMESTER = 1
  private static readonly MAX_SEMESTER = 12

  get value(): number {
    return this.props.value
  }

  private static isValid(semester: number): boolean {
    return semester >= Semester.MIN_SEMESTER && semester <= Semester.MAX_SEMESTER
  }

  public static create(semester: number): Either<SemesterOutOfBoundsError, Semester> {
    if (!Semester.isValid(semester)) {
      return left(
        new SemesterOutOfBoundsError(
          `O semestre deve ser um número entre ${Semester.MIN_SEMESTER} e ${Semester.MAX_SEMESTER}.`,
        ),
      )
    }

    return right(new Semester({ value: semester }))
  }

  public increment(): Either<SemesterOutOfBoundsError, Semester> {
    return Semester.create(this.value + 1)
  }

  public decrement(): Either<SemesterOutOfBoundsError, Semester> {
    return Semester.create(this.value - 1)
  }
}
