import { describe, expect, it } from 'vitest'
import { UserStatus } from './user-status'

describe('UserStatus Value Object', () => {
  describe('enum values', () => {
    it('should have ACTIVE status', () => {
      expect(UserStatus.ACTIVE).toBe('ACTIVE')
    })

    it('should have INACTIVE status', () => {
      expect(UserStatus.INACTIVE).toBe('INACTIVE')
    })

    it('should have BANNED status', () => {
      expect(UserStatus.BANNED).toBe('BANNED')
    })

    it('should have exactly 3 statuses', () => {
      const statuses = Object.values(UserStatus)
      expect(statuses).toHaveLength(3)
    })

    it('should contain all expected statuses', () => {
      const statuses = Object.values(UserStatus)
      expect(statuses).toContain('ACTIVE')
      expect(statuses).toContain('INACTIVE')
      expect(statuses).toContain('BANNED')
    })
  })

  describe('status validation', () => {
    it('should be able to check if value is valid status', () => {
      const validStatus = 'ACTIVE'
      const isValid = Object.values(UserStatus).includes(
        validStatus as UserStatus,
      )
      expect(isValid).toBe(true)
    })

    it('should reject invalid status values', () => {
      const invalidStatus = 'INVALID_STATUS'
      const isValid = Object.values(UserStatus).includes(
        invalidStatus as UserStatus,
      )
      expect(isValid).toBe(false)
    })
  })
})
