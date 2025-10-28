import { type Either, left, right } from '@/shared/either.ts'
import { ValueObject } from '@/shared/kernel/value-object.ts'
import { SemesterOutOfBoundsError } from '../../application/errors/semester-out-of-bounds.error.ts'

interface SemesterProps {
  value: number
}

export class Semester extends ValueObject<SemesterProps> {
  get value() {
    return this.props.value
  }

  static validate(semester: number) {
    return semester < 1 || semester > 12
  }

  static create(semester: number): Either<SemesterOutOfBoundsError, Semester> {
    if (Semester.validate(semester)) {
      return left(
        new SemesterOutOfBoundsError(
          'O semestre deve ser um número entre 1 e 12.',
        ),
      )
    }

    return right(new Semester({ value: semester }))
  }

  increment() {
    if (this.props.value === 12) {
      throw new Error('O semestre não pode ser maior que 12.')
    }

    this.props.value++
  }

  update(semester: number) {
    if (Semester.validate(semester)) {
      throw new Error('O semestre deve ser um número entre 1 e 12.')
    }

    this.props.value = semester
  }
}
