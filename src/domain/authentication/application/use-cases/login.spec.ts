import { InvalidCredentialsError } from '@/shared/errors/invalid-credentials.error.ts'
import { FakeHasher } from 'test/cryptography/fake-hasher.ts'
import { makeUser } from 'test/factories/make-user.ts'
import { InMemoryUsersRepository } from 'test/repositories/users-repository.ts'
import type { User } from '../../enterprise/entities/user.ts'
import type { UsersRepository } from '../repositories/users-repository.ts'
import { LoginUseCase } from './login.ts'

let usersRepository: UsersRepository
let hasher: FakeHasher

let user: User

let sut: LoginUseCase

describe('login use case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    hasher = new FakeHasher()

    user = await makeUser()

    await usersRepository.create(user)

    sut = new LoginUseCase(usersRepository, hasher)
  })

  it('should be able to login a user', async () => {
    const result = await sut.execute({
      email: user.email.value,
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.isRight() && result.value).toMatchObject({
      id: user.id.toString(),
    })
  })

  it('should not be able to login an unregistered user', async () => {
    const result = await sut.execute({
      email: 'janedoe@alu.ufc.br',
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to login a user with wrong password', async () => {
    await usersRepository.create(user)

    const result = await sut.execute({
      email: user.email.value,
      password: '654321',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })
})
