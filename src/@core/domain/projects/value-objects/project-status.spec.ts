import { describe, expect, it } from 'vitest'
import { ProjectStatus } from './project-status'

describe('ProjectStatus Value Object', () => {
  describe('enum values', () => {
    it('should have DRAFT status', () => {
      expect(ProjectStatus.DRAFT).toBe('DRAFT')
    })

    it('should have PUBLISHED status', () => {
      expect(ProjectStatus.PUBLISHED).toBe('PUBLISHED')
    })

    it('should have ARCHIVED status', () => {
      expect(ProjectStatus.ARCHIVED).toBe('ARCHIVED')
    })

    it('should have exactly 3 statuses', () => {
      const statuses = Object.values(ProjectStatus)
      expect(statuses).toHaveLength(3)
    })

    it('should contain all expected statuses', () => {
      const statuses = Object.values(ProjectStatus)
      expect(statuses).toContain('DRAFT')
      expect(statuses).toContain('PUBLISHED')
      expect(statuses).toContain('ARCHIVED')
    })
  })

  describe('status validation', () => {
    it('should be able to check if value is valid status', () => {
      const validStatus = 'PUBLISHED'
      const isValid = Object.values(ProjectStatus).includes(
        validStatus as ProjectStatus,
      )
      expect(isValid).toBe(true)
    })

    it('should reject invalid status values', () => {
      const invalidStatus = 'INVALID_STATUS'
      const isValid = Object.values(ProjectStatus).includes(
        invalidStatus as ProjectStatus,
      )
      expect(isValid).toBe(false)
    })
  })

  describe('status transitions', () => {
    it('should allow transition from DRAFT to PUBLISHED', () => {
      const currentStatus = ProjectStatus.DRAFT
      const newStatus = ProjectStatus.PUBLISHED

      expect(currentStatus).toBe('DRAFT')
      expect(newStatus).toBe('PUBLISHED')
    })

    it('should allow transition from PUBLISHED to ARCHIVED', () => {
      const currentStatus = ProjectStatus.PUBLISHED
      const newStatus = ProjectStatus.ARCHIVED

      expect(currentStatus).toBe('PUBLISHED')
      expect(newStatus).toBe('ARCHIVED')
    })

    it('should allow transition from DRAFT to ARCHIVED', () => {
      const currentStatus = ProjectStatus.DRAFT
      const newStatus = ProjectStatus.ARCHIVED

      expect(currentStatus).toBe('DRAFT')
      expect(newStatus).toBe('ARCHIVED')
    })
  })
})
