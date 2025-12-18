import { describe, expect, it } from 'vitest'
import { BcryptHasher } from './bcrypt-hasher'

describe('BcryptHasher', () => {
  const bcrypt = new BcryptHasher()

  describe('hash()', () => {
    it('should generate a bcrypt hash for a plain text', async () => {
      const plain = 'my-secure-password-123'

      const hashed = await bcrypt.hash(plain)

      expect(hashed).toBeDefined()
      expect(hashed).not.toBe(plain)
      expect(hashed).toMatch(/^\$2[ab]\$\d{2}\$/) // Bcrypt hash format
      expect(hashed.length).toBeGreaterThan(50)
    })

    it('should generate different hashes for same input (salt)', async () => {
      const plain = 'same-password'

      const hash1 = await bcrypt.hash(plain)
      const hash2 = await bcrypt.hash(plain)

      expect(hash1).not.toBe(hash2) // Different salts
    })

    it('should handle empty string', async () => {
      const hashed = await bcrypt.hash('')

      expect(hashed).toBeDefined()
      expect(hashed).toMatch(/^\$2[ab]\$\d{2}\$/)
    })

    it('should handle special characters', async () => {
      const plain = 'P@ssw0rd!#$%^&*()'

      const hashed = await bcrypt.hash(plain)

      expect(hashed).toBeDefined()
      expect(hashed).toMatch(/^\$2[ab]\$\d{2}\$/)
    })

    it('should handle unicode characters', async () => {
      const plain = '密码123🔐'

      const hashed = await bcrypt.hash(plain)

      expect(hashed).toBeDefined()
      expect(hashed).toMatch(/^\$2[ab]\$\d{2}\$/)
    })
  })

  describe('compare()', () => {
    it('should return true when comparing plain text with its hash', async () => {
      const plain = 'correct-password'
      const hashed = await bcrypt.hash(plain)

      const isMatch = await bcrypt.compare(plain, hashed)

      expect(isMatch).toBe(true)
    })

    it('should return false when comparing different plain text with hash', async () => {
      const plain = 'correct-password'
      const wrong = 'wrong-password'
      const hashed = await bcrypt.hash(plain)

      const isMatch = await bcrypt.compare(wrong, hashed)

      expect(isMatch).toBe(false)
    })

    it('should be case sensitive', async () => {
      const plain = 'MyPassword'
      const hashed = await bcrypt.hash(plain)

      const isMatchLower = await bcrypt.compare('mypassword', hashed)
      const isMatchUpper = await bcrypt.compare('MYPASSWORD', hashed)

      expect(isMatchLower).toBe(false)
      expect(isMatchUpper).toBe(false)
    })

    it('should return false for empty string against real hash', async () => {
      const plain = 'real-password'
      const hashed = await bcrypt.hash(plain)

      const isMatch = await bcrypt.compare('', hashed)

      expect(isMatch).toBe(false)
    })

    it('should handle special characters correctly', async () => {
      const plain = 'P@ssw0rd!#$%'
      const hashed = await bcrypt.hash(plain)

      const isMatch = await bcrypt.compare('P@ssw0rd!#$%', hashed)
      const isWrong = await bcrypt.compare('P@ssw0rd!#$', hashed)

      expect(isMatch).toBe(true)
      expect(isWrong).toBe(false)
    })

    it('should handle unicode characters correctly', async () => {
      const plain = '密码123🔐'
      const hashed = await bcrypt.hash(plain)

      const isMatch = await bcrypt.compare('密码123🔐', hashed)
      const isWrong = await bcrypt.compare('密码123', hashed)

      expect(isMatch).toBe(true)
      expect(isWrong).toBe(false)
    })

    it('should return false for invalid hash format', async () => {
      const plain = 'password'
      const invalidHash = 'not-a-valid-bcrypt-hash'

      const isMatch = await bcrypt.compare(plain, invalidHash)

      expect(isMatch).toBe(false)
    })
  })

  describe('integration', () => {
    it('should work in complete authentication flow', async () => {
      // Registration: hash password
      const userPassword = 'user-secret-password-123'
      const storedHash = await bcrypt.hash(userPassword)

      // Login: compare provided password with stored hash
      const loginAttempt1 = await bcrypt.compare('user-secret-password-123', storedHash)
      const loginAttempt2 = await bcrypt.compare('wrong-password', storedHash)
      const loginAttempt3 = await bcrypt.compare('user-secret-password-124', storedHash)

      expect(loginAttempt1).toBe(true) // Correct password
      expect(loginAttempt2).toBe(false) // Wrong password
      expect(loginAttempt3).toBe(false) // Almost correct but wrong
    })

    it('should validate multiple users with different passwords', async () => {
      const user1Password = 'alice-password'
      const user2Password = 'bob-password'

      const user1Hash = await bcrypt.hash(user1Password)
      const user2Hash = await bcrypt.hash(user2Password)

      // User 1 login attempts
      expect(await bcrypt.compare('alice-password', user1Hash)).toBe(true)
      expect(await bcrypt.compare('bob-password', user1Hash)).toBe(false)

      // User 2 login attempts
      expect(await bcrypt.compare('bob-password', user2Hash)).toBe(true)
      expect(await bcrypt.compare('alice-password', user2Hash)).toBe(false)
    })
  })
})
