import { ResetPasswordUseCase } from '@/@core/application/users/use-cases/reset-password'
import { ResourceNotFoundError } from '@/@shared/kernel/errors/resource-not-found.error'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeUser } from 'test/factories/make-user'
import { InMemoryUsersRepository } from 'test/repositories/users-repository'

let usersRepository: InMemoryUsersRepository
let hashGenerator: FakeHasher
let sut: ResetPasswordUseCase

describe('ResetPasswordUseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    hashGenerator = new FakeHasher()
    sut = new ResetPasswordUseCase(usersRepository, hashGenerator)
  })

  it('should be able to reset password', async () => {
    const user = await makeUser()
    const token = 'valid-token'
    const expires = new Date()
    expires.setHours(expires.getHours() + 1)

    user.setPasswordResetToken(token, expires)
    await usersRepository.create(user)

    const result = await sut.execute({
      token,
      newPassword: 'new-password',
    })

    expect(result.isRight()).toBe(true)

    const updatedUser = await usersRepository.findById(user.id.toString())
    expect(updatedUser?.passwordHash).toEqual('new-password-hashed')
    expect(updatedUser?.passwordResetToken).toBeUndefined()
    expect(updatedUser?.passwordResetExpires).toBeUndefined()
  })

  it('should not be able to reset password with invalid token', async () => {
    const result = await sut.execute({
      token: 'invalid-token',
      newPassword: 'new-password',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to reset password with expired token', async () => {
    const user = await makeUser()
    const token = 'expired-token'
    const expires = new Date()
    expires.setHours(expires.getHours() - 1)

    user.setPasswordResetToken(token, expires)
    await usersRepository.create(user)

    const result = await sut.execute({
      token,
      newPassword: 'new-password',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(Error)
    expect((result.value as Error).message).toEqual('Token expired')
  })
})
