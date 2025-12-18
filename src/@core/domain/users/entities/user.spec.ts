import { describe, expect, it } from 'vitest'
import { User } from './user'
import { Email } from '../value-objects/email'
import { Username } from '../value-objects/username'
import { UserRole } from '../value-objects/user-role'
import { UserStatus } from '../value-objects/user-status'
import { UniqueEntityID } from '@/@shared/kernel/kernel/unique-entity-id'
import { Semester } from '../value-objects/semester'

describe('User Entity', () => {
  const makeValidUser = () => {
    const emailResult = Email.create('student@alu.ufc.br')
    const usernameResult = Username.create('johndoe')

    if (emailResult.isLeft() || usernameResult.isLeft()) {
      throw new Error('Failed to create valid user')
    }

    return User.create({
      name: 'John Doe',
      username: usernameResult.value,
      email: emailResult.value,
      passwordHash: 'hashed_password',
      role: UserRole.STUDENT,
      status: UserStatus.ACTIVE,
    })
  }

  describe('create', () => {
    it('should create a user with valid props', () => {
      const user = makeValidUser()

      expect(user).toBeInstanceOf(User)
      expect(user.name).toBe('John Doe')
      expect(user.username.value).toBe('johndoe')
      expect(user.email.value).toBe('student@alu.ufc.br')
      expect(user.role).toBe(UserRole.STUDENT)
      expect(user.status).toBe(UserStatus.ACTIVE)
    })

    it('should create a user with optional about and profileUrl', () => {
      const emailResult = Email.create('student@alu.ufc.br')
      const usernameResult = Username.create('johndoe')

      if (emailResult.isLeft() || usernameResult.isLeft()) {
        throw new Error('Failed to create valid user')
      }

      const user = User.create({
        name: 'John Doe',
        username: usernameResult.value,
        email: emailResult.value,
        passwordHash: 'hashed_password',
        role: UserRole.STUDENT,
        status: UserStatus.ACTIVE,
        about: 'Software Developer',
        profileUrl: 'https://example.com/profile.jpg',
      })

      expect(user.about).toBe('Software Developer')
      expect(user.profileUrl).toBe('https://example.com/profile.jpg')
    })
  })

  describe('reconstitute', () => {
    it('should reconstitute a user with timestamps', () => {
      const emailResult = Email.create('student@alu.ufc.br')
      const usernameResult = Username.create('johndoe')

      if (emailResult.isLeft() || usernameResult.isLeft()) {
        throw new Error('Failed to create valid user')
      }

      const id = new UniqueEntityID()
      const createdAt = new Date('2024-01-01')
      const updatedAt = new Date('2024-01-02')

      const user = User.reconstitute(
        {
          name: 'John Doe',
          username: usernameResult.value,
          email: emailResult.value,
          passwordHash: 'hashed_password',
          role: UserRole.STUDENT,
          status: UserStatus.ACTIVE,
        },
        id,
        createdAt,
        updatedAt,
      )

      expect(user.id).toBe(id)
      expect(user.createdAt).toBe(createdAt)
      expect(user.updatedAt).toBe(updatedAt)
    })
  })

  describe('updateAbout', () => {
    it('should update about field', () => {
      const user = makeValidUser()
      const beforeUpdate = user.updatedAt

      user.updateAbout('New bio')

      expect(user.about).toBe('New bio')
      expect(user.updatedAt).not.toBe(beforeUpdate)
    })

    it('should clear about field when undefined', () => {
      const user = makeValidUser()
      user.updateAbout('Initial bio')
      user.updateAbout(undefined)

      expect(user.about).toBeUndefined()
    })
  })

  describe('changeProfilePicture', () => {
    it('should update profile picture URL', () => {
      const user = makeValidUser()

      user.changeProfilePicture('https://example.com/new-pic.jpg')

      expect(user.profileUrl).toBe('https://example.com/new-pic.jpg')
    })

    it('should clear profile picture when undefined', () => {
      const user = makeValidUser()
      user.changeProfilePicture('https://example.com/pic.jpg')
      user.changeProfilePicture(undefined)

      expect(user.profileUrl).toBeUndefined()
    })
  })

  describe('status management', () => {
    it('should check if user is active', () => {
      const user = makeValidUser()

      expect(user.isActive()).toBe(true)
      expect(user.isInactive()).toBe(false)
      expect(user.isBanned()).toBe(false)
    })

    it('should activate a user', () => {
      const user = makeValidUser()
      user.inactivate()

      user.activate()

      expect(user.status).toBe(UserStatus.ACTIVE)
      expect(user.isActive()).toBe(true)
    })

    it('should inactivate a user', () => {
      const user = makeValidUser()

      user.inactivate()

      expect(user.status).toBe(UserStatus.INACTIVE)
      expect(user.isInactive()).toBe(true)
    })

    it('should ban a user', () => {
      const user = makeValidUser()

      user.ban()

      expect(user.status).toBe(UserStatus.BANNED)
      expect(user.isBanned()).toBe(true)
    })

    it('should unban a user (sets to ACTIVE)', () => {
      const user = makeValidUser()
      user.ban()

      user.unban()

      expect(user.status).toBe(UserStatus.ACTIVE)
      expect(user.isActive()).toBe(true)
    })
  })

  describe('role management', () => {
    it('should change user role', () => {
      const user = makeValidUser()

      user.changeRole(UserRole.MODERATOR)

      expect(user.role).toBe(UserRole.MODERATOR)
    })
  })

  describe('student profile management', () => {
    it('should create a student profile', () => {
      const user = makeValidUser()

      user.createProfile(3)

      expect(user.profile).toBeDefined()
      expect(user.profile?.semester.value).toBe(3)
    })

    it('should throw error when creating profile for user that already has one', () => {
      const user = makeValidUser()
      user.createProfile(3)

      expect(() => user.createProfile(5)).toThrow(
        'O usuário já possui um perfil de estudante.',
      )
    })

    it('should throw error when creating profile with invalid semester', () => {
      const user = makeValidUser()

      expect(() => user.createProfile(0)).toThrow()
      expect(() => user.createProfile(13)).toThrow()
    })

    it('should add trail to profile', () => {
      const user = makeValidUser()
      user.createProfile(3)
      const trailId = new UniqueEntityID()

      user.addTrailToProfile(trailId)

      expect(user.profile?.trailsIds).toContain(trailId)
    })

    it('should throw error when adding trail without profile', () => {
      const user = makeValidUser()
      const trailId = new UniqueEntityID()

      expect(() => user.addTrailToProfile(trailId)).toThrow(
        'O usuário não possui um perfil de estudante.',
      )
    })

    it('should remove trail from profile', () => {
      const user = makeValidUser()
      user.createProfile(3)
      const trailId = new UniqueEntityID()
      user.addTrailToProfile(trailId)

      user.removeTrailFromProfile(trailId)

      expect(user.profile?.trailsIds).not.toContain(trailId)
    })

    it('should throw error when removing trail without profile', () => {
      const user = makeValidUser()
      const trailId = new UniqueEntityID()

      expect(() => user.removeTrailFromProfile(trailId)).toThrow(
        'O usuário não possui um perfil de estudante.',
      )
    })
  })

  describe('password reset', () => {
    it('should set password reset token and expiry', () => {
      const user = makeValidUser()
      const token = 'reset_token_123'
      const expires = new Date(Date.now() + 3600000)

      user.setPasswordResetToken(token, expires)

      expect(user.passwordResetToken).toBe(token)
      expect(user.passwordResetExpires).toBe(expires)
    })

    it('should clear password reset token', () => {
      const user = makeValidUser()
      user.setPasswordResetToken('token', new Date())

      user.clearPasswordResetToken()

      expect(user.passwordResetToken).toBeUndefined()
      expect(user.passwordResetExpires).toBeUndefined()
    })
  })

  describe('password management', () => {
    it('should update password hash', () => {
      const user = makeValidUser()
      const newPasswordHash = 'new_hashed_password'

      user.updatePassword(newPasswordHash)

      expect(user.passwordHash).toBe(newPasswordHash)
    })
  })

  describe('getters', () => {
    it('should access all user properties via getters', () => {
      const emailResult = Email.create('student@alu.ufc.br')
      const usernameResult = Username.create('johndoe')

      if (emailResult.isLeft() || usernameResult.isLeft()) {
        throw new Error('Failed to create valid user')
      }

      const user = User.create({
        name: 'John Doe',
        username: usernameResult.value,
        email: emailResult.value,
        passwordHash: 'hashed_password',
        role: UserRole.STUDENT,
        status: UserStatus.ACTIVE,
        about: 'Developer',
        profileUrl: 'https://example.com/pic.jpg',
      })

      expect(user.name).toBe('John Doe')
      expect(user.username).toBe(usernameResult.value)
      expect(user.email).toBe(emailResult.value)
      expect(user.passwordHash).toBe('hashed_password')
      expect(user.about).toBe('Developer')
      expect(user.profileUrl).toBe('https://example.com/pic.jpg')
      expect(user.role).toBe(UserRole.STUDENT)
      expect(user.status).toBe(UserStatus.ACTIVE)
      expect(user.profile).toBeUndefined()
      expect(user.passwordResetToken).toBeUndefined()
      expect(user.passwordResetExpires).toBeUndefined()
    })
  })
})
