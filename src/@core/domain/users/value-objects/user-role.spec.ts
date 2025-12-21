import { describe, expect, it } from 'vitest'
import { UserRole } from './user-role'

describe('UserRole Value Object', () => {
  describe('enum values', () => {
    it('should have STUDENT role', () => {
      expect(UserRole.STUDENT).toBe('STUDENT')
    })

    it('should have CURATOR role', () => {
      expect(UserRole.CURATOR).toBe('CURATOR')
    })

    it('should have MODERATOR role', () => {
      expect(UserRole.MODERATOR).toBe('MODERATOR')
    })

    it('should have ADMIN role', () => {
      expect(UserRole.ADMIN).toBe('ADMIN')
    })

    it('should have exactly 4 roles', () => {
      const roles = Object.values(UserRole)
      expect(roles).toHaveLength(4)
    })

    it('should contain all expected roles', () => {
      const roles = Object.values(UserRole)
      expect(roles).toContain('STUDENT')
      expect(roles).toContain('CURATOR')
      expect(roles).toContain('MODERATOR')
      expect(roles).toContain('ADMIN')
    })
  })

  describe('role hierarchy', () => {
    it('should be able to check if value is valid role', () => {
      const validRole = 'STUDENT'
      const isValid = Object.values(UserRole).includes(validRole as UserRole)
      expect(isValid).toBe(true)
    })

    it('should reject invalid role values', () => {
      const invalidRole = 'INVALID_ROLE'
      const isValid = Object.values(UserRole).includes(invalidRole as UserRole)
      expect(isValid).toBe(false)
    })
  })
})
