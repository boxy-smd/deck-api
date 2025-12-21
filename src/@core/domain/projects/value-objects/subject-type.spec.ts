import { describe, expect, it } from 'vitest'
import { SubjectType } from './subject-type'

describe('SubjectType Value Object', () => {
  describe('enum values', () => {
    it('should have OBLIGATORY type', () => {
      expect(SubjectType.OBLIGATORY).toBe('OBLIGATORY')
    })

    it('should have ELECTIVE type', () => {
      expect(SubjectType.ELECTIVE).toBe('ELECTIVE')
    })

    it('should have OPTIONAL type', () => {
      expect(SubjectType.OPTIONAL).toBe('OPTIONAL')
    })

    it('should have exactly 3 types', () => {
      const types = Object.values(SubjectType)
      expect(types).toHaveLength(3)
    })

    it('should contain all expected types', () => {
      const types = Object.values(SubjectType)
      expect(types).toContain('OBLIGATORY')
      expect(types).toContain('ELECTIVE')
      expect(types).toContain('OPTIONAL')
    })
  })

  describe('type validation', () => {
    it('should be able to check if value is valid type', () => {
      const validType = 'OBLIGATORY'
      const isValid = Object.values(SubjectType).includes(
        validType as SubjectType,
      )
      expect(isValid).toBe(true)
    })

    it('should reject invalid type values', () => {
      const invalidType = 'INVALID_TYPE'
      const isValid = Object.values(SubjectType).includes(
        invalidType as SubjectType,
      )
      expect(isValid).toBe(false)
    })
  })
})
