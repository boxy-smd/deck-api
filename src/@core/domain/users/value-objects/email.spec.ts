import { describe, expect, it } from 'vitest'
import { EmailBadFormattedError } from '../../../application/users/errors/email-bad-formatted.error'
import { Email } from './email'

describe('Email Value Object', () => {
  describe('create()', () => {
    it('should create email with valid institutional format', () => {
      const result = Email.create('joao@alu.ufc.br')

      expect(result.isRight()).toBe(true)
      if (result.isRight()) {
        expect(result.value.value).toBe('joao@alu.ufc.br')
      }
    })

    it('should accept email with numbers', () => {
      const result = Email.create('joao123@alu.ufc.br')

      expect(result.isRight()).toBe(true)
    })

    it('should accept email with dots and underscores', () => {
      const result = Email.create('joao.silva_123@alu.ufc.br')

      expect(result.isRight()).toBe(true)
    })

    it('should reject non-institutional email', () => {
      const result = Email.create('joao@gmail.com')

      expect(result.isLeft()).toBe(true)
      if (result.isLeft()) {
        expect(result.value).toBeInstanceOf(EmailBadFormattedError)
        expect(result.value.message).toContain('institucional')
      }
    })

    it('should reject email without domain', () => {
      const result = Email.create('joaosilva')

      expect(result.isLeft()).toBe(true)
      if (result.isLeft()) {
        expect(result.value).toBeInstanceOf(EmailBadFormattedError)
      }
    })

    it('should reject email with invalid format', () => {
      const result = Email.create('joao@')

      expect(result.isLeft()).toBe(true)
      if (result.isLeft()) {
        expect(result.value).toBeInstanceOf(EmailBadFormattedError)
      }
    })

    it('should reject email with spaces', () => {
      const result = Email.create('joao silva@alu.ufc.br')

      expect(result.isLeft()).toBe(true)
    })

    it('should reject empty email', () => {
      const result = Email.create('')

      expect(result.isLeft()).toBe(true)
    })

    it('should reject email from other institutions', () => {
      const result = Email.create('joao@ufc.br')

      expect(result.isLeft()).toBe(true)
      if (result.isLeft()) {
        expect(result.value.message).toContain('institucional')
      }
    })

    it('should be case sensitive for domain', () => {
      const result = Email.create('joao@ALU.UFC.BR')

      expect(result.isLeft()).toBe(true)
    })
  })
})
