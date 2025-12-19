import { describe, expect, it } from 'vitest'
import { UsernameBadFormattedError } from '../../../application/users/errors/username-bad-formatted.error'
import { Username } from './username'

describe('Username Value Object', () => {
  describe('create()', () => {
    it('should create username with valid format', () => {
      const result = Username.create('joaosilva')

      expect(result.isRight()).toBe(true)
      if (result.isRight()) {
        expect(result.value.value).toBe('joaosilva')
      }
    })

    it('should accept username with numbers', () => {
      const result = Username.create('joao123')

      expect(result.isRight()).toBe(true)
    })

    it('should accept username with underscores', () => {
      const result = Username.create('joao_silva')

      expect(result.isRight()).toBe(true)
    })

    it('should accept username with hyphens', () => {
      const result = Username.create('joao-silva')

      expect(result.isRight()).toBe(true)
    })

    it('should accept username with dots', () => {
      const result = Username.create('joao.silva')

      expect(result.isRight()).toBe(true)
    })

    it('should accept username with minimum length (3 chars)', () => {
      const result = Username.create('abc')

      expect(result.isRight()).toBe(true)
    })

    it('should accept username with maximum length (20 chars)', () => {
      const result = Username.create('a'.repeat(20))

      expect(result.isRight()).toBe(true)
    })

    it('should reject username that is too short (< 3 chars)', () => {
      const result = Username.create('ab')

      expect(result.isLeft()).toBe(true)
      if (result.isLeft()) {
        expect(result.value).toBeInstanceOf(UsernameBadFormattedError)
      }
    })

    it('should reject username that is too long (> 20 chars)', () => {
      const result = Username.create('a'.repeat(21))

      expect(result.isLeft()).toBe(true)
      if (result.isLeft()) {
        expect(result.value).toBeInstanceOf(UsernameBadFormattedError)
      }
    })

    it('should reject username with spaces', () => {
      const result = Username.create('joao silva')

      expect(result.isLeft()).toBe(true)
      if (result.isLeft()) {
        expect(result.value).toBeInstanceOf(UsernameBadFormattedError)
      }
    })

    it('should reject username with special characters', () => {
      const result = Username.create('joao@silva')

      expect(result.isLeft()).toBe(true)
      if (result.isLeft()) {
        expect(result.value).toBeInstanceOf(UsernameBadFormattedError)
      }
    })

    it('should reject username with accented characters', () => {
      const result = Username.create('joãosilva')

      expect(result.isLeft()).toBe(true)
      if (result.isLeft()) {
        expect(result.value).toBeInstanceOf(UsernameBadFormattedError)
      }
    })

    it('should reject empty username', () => {
      const result = Username.create('')

      expect(result.isLeft()).toBe(true)
    })
  })

  describe('validate()', () => {
    it('should return validation flags correctly', () => {
      const [isBadFormatted, isTooShort, isTooLong] =
        Username.validate('joaosilva')

      expect(isBadFormatted).toBe(false)
      expect(isTooShort).toBe(false)
      expect(isTooLong).toBe(false)
    })

    it('should detect bad formatted username', () => {
      const [isBadFormatted] = Username.validate('joao@silva')

      expect(isBadFormatted).toBe(true)
    })

    it('should detect username too short', () => {
      const [, isTooShort] = Username.validate('ab')

      expect(isTooShort).toBe(true)
    })

    it('should detect username too long', () => {
      const [, , isTooLong] = Username.validate('a'.repeat(21))

      expect(isTooLong).toBe(true)
    })
  })
})
