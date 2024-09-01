import { beforeEach, describe, expect, it } from 'vitest'

import { User } from '@/domain/entities/user.entity.ts'
import { Base64Encrypter } from '@/infra/cryptography/base64-encrypter.ts'
import { InMemoryUsersRepository } from '@/infra/database/in-memory/repositories/users-repository.ts'
import { InvalidCredentialsError } from '../errors/invalid-credentials.error.ts'
import { LoginUseCase } from './login.ts'

let usersRepository: InMemoryUsersRepository
let sut: LoginUseCase
let passwordHash: string
let user: User

describe('login use case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    const encrypter = new Base64Encrypter()
    passwordHash = await User.hashPassword('123456', encrypter)
    sut = new LoginUseCase(usersRepository, encrypter)

    const userOrError = User.create({
      name: 'John Doe',
      email: 'johndoe@alu.ufc.br',
      passwordHash,
      semester: 3,
      username: 'johndoe',
    })

    if (userOrError.isLeft()) {
      throw userOrError.value
    }

    user = userOrError.value
  })

  it('should be able to login a user', async () => {
    await usersRepository.create(user)

    const result = await sut.execute({
      email: 'johndoe@alu.ufc.br',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.isRight() && result.value).toBeInstanceOf(User)
  })

  it('should not be able to login a user with no email', async () => {
    const result = await sut.execute({
      email: '',
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.isLeft() && result.value).toBeInstanceOf(
      InvalidCredentialsError,
    )
  })

  it('should not be able to login a user with no password', async () => {
    const result = await sut.execute({
      email: 'johndoe@alu.ufc.br',
      password: '',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.isLeft() && result.value).toBeInstanceOf(
      InvalidCredentialsError,
    )
  })

  it('should not be able to login an unregistered user', async () => {
    const result = await sut.execute({
      email: 'janedoe@alu.ufc.br',
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.isLeft() && result.value).toBeInstanceOf(
      InvalidCredentialsError,
    )
  })

  it('should not be able to login a user with wrong password', async () => {
    await usersRepository.create(user)

    const result = await sut.execute({
      email: 'johndoe@alu.ufc.br',
      password: '654321',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.isLeft() && result.value).toBeInstanceOf(
      InvalidCredentialsError,
    )
  })
})
