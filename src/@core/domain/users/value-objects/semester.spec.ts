import { describe, expect, it } from 'vitest'
import { SemesterOutOfBoundsError } from '../../../application/users/errors/semester-out-of-bounds.error'
import { Semester } from './semester'

describe('Semester Value Object', () => {
  describe('create()', () => {
    it('should create semester with valid value', () => {
      const result = Semester.create(5)

      expect(result.isRight()).toBe(true)
      if (result.isRight()) {
        expect(result.value.value).toBe(5)
      }
    })

    it('should accept minimum semester (1)', () => {
      const result = Semester.create(1)

      expect(result.isRight()).toBe(true)
      if (result.isRight()) {
        expect(result.value.value).toBe(1)
      }
    })

    it('should accept maximum semester (12)', () => {
      const result = Semester.create(12)

      expect(result.isRight()).toBe(true)
      if (result.isRight()) {
        expect(result.value.value).toBe(12)
      }
    })

    it('should reject semester below minimum (0)', () => {
      const result = Semester.create(0)

      expect(result.isLeft()).toBe(true)
      if (result.isLeft()) {
        expect(result.value).toBeInstanceOf(SemesterOutOfBoundsError)
        expect(result.value.message).toContain('entre 1 e 12')
      }
    })

    it('should reject semester above maximum (13)', () => {
      const result = Semester.create(13)

      expect(result.isLeft()).toBe(true)
      if (result.isLeft()) {
        expect(result.value).toBeInstanceOf(SemesterOutOfBoundsError)
        expect(result.value.message).toContain('entre 1 e 12')
      }
    })

    it('should reject negative semester', () => {
      const result = Semester.create(-1)

      expect(result.isLeft()).toBe(true)
    })
  })

  describe('increment()', () => {
    it('should increment semester by 1', () => {
      const semester = Semester.create(5)

      expect(semester.isRight()).toBe(true)
      if (semester.isRight()) {
        const incremented = semester.value.increment()

        expect(incremented.isRight()).toBe(true)
        if (incremented.isRight()) {
          expect(incremented.value.value).toBe(6)
        }
      }
    })

    it('should allow increment from 11 to 12', () => {
      const semester = Semester.create(11)

      expect(semester.isRight()).toBe(true)
      if (semester.isRight()) {
        const incremented = semester.value.increment()

        expect(incremented.isRight()).toBe(true)
        if (incremented.isRight()) {
          expect(incremented.value.value).toBe(12)
        }
      }
    })

    it('should fail to increment semester 12 (boundary)', () => {
      const semester = Semester.create(12)

      expect(semester.isRight()).toBe(true)
      if (semester.isRight()) {
        const incremented = semester.value.increment()

        expect(incremented.isLeft()).toBe(true)
        if (incremented.isLeft()) {
          expect(incremented.value).toBeInstanceOf(SemesterOutOfBoundsError)
        }
      }
    })
  })

  describe('decrement()', () => {
    it('should decrement semester by 1', () => {
      const semester = Semester.create(5)

      expect(semester.isRight()).toBe(true)
      if (semester.isRight()) {
        const decremented = semester.value.decrement()

        expect(decremented.isRight()).toBe(true)
        if (decremented.isRight()) {
          expect(decremented.value.value).toBe(4)
        }
      }
    })

    it('should allow decrement from 2 to 1', () => {
      const semester = Semester.create(2)

      expect(semester.isRight()).toBe(true)
      if (semester.isRight()) {
        const decremented = semester.value.decrement()

        expect(decremented.isRight()).toBe(true)
        if (decremented.isRight()) {
          expect(decremented.value.value).toBe(1)
        }
      }
    })

    it('should fail to decrement semester 1 (boundary)', () => {
      const semester = Semester.create(1)

      expect(semester.isRight()).toBe(true)
      if (semester.isRight()) {
        const decremented = semester.value.decrement()

        expect(decremented.isLeft()).toBe(true)
        if (decremented.isLeft()) {
          expect(decremented.value).toBeInstanceOf(SemesterOutOfBoundsError)
        }
      }
    })
  })
})
