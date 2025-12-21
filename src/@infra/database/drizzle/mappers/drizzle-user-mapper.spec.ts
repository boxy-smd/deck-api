import { UserRole } from '@/@core/domain/users/value-objects/user-role'
import { UserStatus } from '@/@core/domain/users/value-objects/user-status'
import { describe, expect, it } from 'vitest'
import { DrizzleUserMapper } from './drizzle-user-mapper'
import type { DrizzleUserWithProfile } from './drizzle-user-mapper'

describe('DrizzleUserMapper', () => {
  describe('toEntity()', () => {
    it('should map user without profile to entity', () => {
      const raw: DrizzleUserWithProfile = {
        id: 'user-id-1',
        name: 'João Silva',
        username: 'joaosilva',
        email: 'joao@alu.ufc.br',
        passwordHash: 'hashed-password',
        about: null,
        profileUrl: null,
        role: 'STUDENT',
        status: 'ACTIVE',
        passwordResetToken: null,
        passwordResetExpires: null,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        studentProfile: null,
        trails: [],
      }

      const user = DrizzleUserMapper.toEntity(raw)

      expect(user.id.toString()).toBe('user-id-1')
      expect(user.name).toBe('João Silva')
      expect(user.username.value).toBe('joaosilva')
      expect(user.email.value).toBe('joao@alu.ufc.br')
      expect(user.passwordHash).toBe('hashed-password')
      expect(user.role).toBe(UserRole.STUDENT)
      expect(user.status).toBe(UserStatus.ACTIVE)
      expect(user.profile).toBeUndefined()
    })

    it('should map user with profile to entity', () => {
      const raw: DrizzleUserWithProfile = {
        id: 'user-id-2',
        name: 'Maria Santos',
        username: 'mariasantos',
        email: 'maria@alu.ufc.br',
        passwordHash: 'hashed-password',
        about: 'Desenvolvedora Full Stack',
        profileUrl: 'https://example.com/profile.jpg',
        role: 'STUDENT',
        status: 'ACTIVE',
        passwordResetToken: null,
        passwordResetExpires: null,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        studentProfile: {
          studentId: 'user-id-2',
          semester: 5,
        },
        trails: [
          {
            trail: {
              id: 'trail-1',
              name: 'Design Digital',
              createdAt: new Date('2024-01-01'),
              updatedAt: new Date('2024-01-01'),
            },
          },
          {
            trail: {
              id: 'trail-2',
              name: 'Desenvolvimento de Sistemas',
              createdAt: new Date('2024-01-01'),
              updatedAt: new Date('2024-01-01'),
            },
          },
        ],
      }

      const user = DrizzleUserMapper.toEntity(raw)

      expect(user.id.toString()).toBe('user-id-2')
      expect(user.name).toBe('Maria Santos')
      expect(user.about).toBe('Desenvolvedora Full Stack')
      expect(user.profileUrl).toBe('https://example.com/profile.jpg')
      expect(user.profile).toBeDefined()
      expect(user.profile?.semester.value).toBe(5)
      expect(user.profile?.trailsIds.length).toBe(0)
    })

    it('should map user with password reset token', () => {
      const resetExpires = new Date('2024-12-31')
      const raw: DrizzleUserWithProfile = {
        id: 'user-id-3',
        name: 'Pedro Costa',
        username: 'pedrocosta',
        email: 'pedro@alu.ufc.br',
        passwordHash: 'hashed-password',
        about: null,
        profileUrl: null,
        role: 'STUDENT',
        status: 'ACTIVE',
        passwordResetToken: 'reset-token-123',
        passwordResetExpires: resetExpires,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        studentProfile: null,
        trails: [],
      }

      const user = DrizzleUserMapper.toEntity(raw)

      expect(user.passwordResetToken).toBe('reset-token-123')
      expect(user.passwordResetExpires).toEqual(resetExpires)
    })

    it('should map user with different roles', () => {
      const rawModerator: DrizzleUserWithProfile = {
        id: 'user-id-4',
        name: 'Ana Moderadora',
        username: 'anamoderador',
        email: 'ana@alu.ufc.br',
        passwordHash: 'hashed-password',
        about: null,
        profileUrl: null,
        role: 'MODERATOR',
        status: 'ACTIVE',
        passwordResetToken: null,
        passwordResetExpires: null,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        studentProfile: null,
        trails: [],
      }

      const user = DrizzleUserMapper.toEntity(rawModerator)

      expect(user.role).toBe(UserRole.MODERATOR)
    })

    it('should map user with different statuses', () => {
      const rawInactive: DrizzleUserWithProfile = {
        id: 'user-id-5',
        name: 'Carlos Inativo',
        username: 'carlosinativo',
        email: 'carlos@alu.ufc.br',
        passwordHash: 'hashed-password',
        about: null,
        profileUrl: null,
        role: 'STUDENT',
        status: 'INACTIVE',
        passwordResetToken: null,
        passwordResetExpires: null,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        studentProfile: null,
        trails: [],
      }

      const user = DrizzleUserMapper.toEntity(rawInactive)

      expect(user.status).toBe(UserStatus.INACTIVE)
    })

    it('should throw error for invalid email', () => {
      const rawInvalidEmail: DrizzleUserWithProfile = {
        id: 'user-id-6',
        name: 'Invalid User',
        username: 'invaliduser',
        email: 'invalid@gmail.com',
        passwordHash: 'hashed-password',
        about: null,
        profileUrl: null,
        role: 'STUDENT',
        status: 'ACTIVE',
        passwordResetToken: null,
        passwordResetExpires: null,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        studentProfile: null,
        trails: [],
      }

      expect(() => DrizzleUserMapper.toEntity(rawInvalidEmail)).toThrow()
    })

    it('should throw error for invalid username', () => {
      const rawInvalidUsername: DrizzleUserWithProfile = {
        id: 'user-id-7',
        name: 'Invalid User',
        username: 'ab',
        email: 'valid@alu.ufc.br',
        passwordHash: 'hashed-password',
        about: null,
        profileUrl: null,
        role: 'STUDENT',
        status: 'ACTIVE',
        passwordResetToken: null,
        passwordResetExpires: null,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        studentProfile: null,
        trails: [],
      }

      expect(() => DrizzleUserMapper.toEntity(rawInvalidUsername)).toThrow()
    })

    it('should throw error for invalid semester in profile', () => {
      const rawInvalidSemester: DrizzleUserWithProfile = {
        id: 'user-id-8',
        name: 'Invalid User',
        username: 'invaliduser',
        email: 'valid@alu.ufc.br',
        passwordHash: 'hashed-password',
        about: null,
        profileUrl: null,
        role: 'STUDENT',
        status: 'ACTIVE',
        passwordResetToken: null,
        passwordResetExpires: null,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        studentProfile: {
          studentId: 'user-id-8',
          semester: 15,
        },
        trails: [],
      }

      expect(() => DrizzleUserMapper.toEntity(rawInvalidSemester)).toThrow()
    })
  })
})
