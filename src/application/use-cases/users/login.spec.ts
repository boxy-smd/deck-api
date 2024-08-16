import { User } from '@/domain/entities/user.entity.ts'
import { Base64Encrypter } from '@/infra/cryptography/base64-encrypter.ts'
import { InMemoryUsersRepository } from '@/infra/database/in-memory/repositories/users-repository.ts'
import { beforeEach, describe, expect, it } from 'vitest'
import { InvalidCredentialsError } from './errors/invalid-credentials.error.ts'
import { LoginUseCase } from './login.ts'

let usersRepository: InMemoryUsersRepository
let sut: LoginUseCase
let passwordHash: string
let user: User

describe('login use case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    const bcryptEncrypter = new Base64Encrypter()
    passwordHash = await User.hashPassword('123456', bcryptEncrypter)
    sut = new LoginUseCase(usersRepository, bcryptEncrypter)

    user = User.create({
      name: 'John Doe',
      email: 'johndoe@alu.ufc.br',
      passwordHash,
      semester: 3,
      username: 'johndoe',
    })
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

  it('should be not able to login a user with no email', async () => {
    const result = await sut.execute({
      email: '',
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.isLeft() && result.value).toBeInstanceOf(
      InvalidCredentialsError,
    )
  })

  it('should be not able to login a user with no password', async () => {
    const result = await sut.execute({
      email: 'johndoe@alu.ufc.br',
      password: '',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.isLeft() && result.value).toBeInstanceOf(
      InvalidCredentialsError,
    )
  })

  it('should be not able to login a unregistered user', async () => {
    await usersRepository.create(user)

    const result = await sut.execute({
      email: 'janedoe@alu.ufc.br',
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.isLeft() && result.value).toBeInstanceOf(
      InvalidCredentialsError,
    )
  })

  it('should be not able to login a user with wrong password', async () => {
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
