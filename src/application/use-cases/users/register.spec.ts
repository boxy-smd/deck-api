import { User } from '@/domain/entities/user.entity.ts'
import { EmailBadFormattedError } from '@/domain/value-objects/errors/email-bad-formatted.error.ts'
import { Base64Encrypter } from '@/infra/cryptography/base64-encrypter.ts'
import { InMemoryUsersRepository } from '@/infra/database/in-memory/repositories/users-repository.ts'
import { beforeEach, describe, expect, it } from 'vitest'
import { InvalidCredentialsError } from './errors/invalid-credentials.error.ts'
import { UserAlreadyExistsError } from './errors/user-already-exists.error.ts'
import { RegisterUseCase } from './register.ts'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase
let passwordHash: string

describe('register use case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    const bcryptEncrypter = new Base64Encrypter()
    passwordHash = await User.hashPassword('123456', bcryptEncrypter)
    sut = new RegisterUseCase(usersRepository, bcryptEncrypter)
  })

  it('should be able to register a user', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@alu.ufc.br',
      password: '123456',
      semester: 3,
      username: 'johndoe',
    })

    expect(result.isRight()).toBe(true)
    expect(result.isRight() && result.value).toBeInstanceOf(User)
  })

  it('should be not able to register a user with no name', async () => {
    const result = await sut.execute({
      name: '',
      email: 'johndoe@alu.ufc.br',
      password: '123456',
      semester: 3,
      username: 'johndoe',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.isLeft() && result.value).toBeInstanceOf(
      InvalidCredentialsError,
    )
  })

  it('should be not able to register a user with no email', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: '',
      password: '123456',
      semester: 3,
      username: 'johndoe',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.isLeft() && result.value).toBeInstanceOf(
      InvalidCredentialsError,
    )
  })

  it('should be not able to register a user with no password', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@alu.ufc.br',
      password: '',
      semester: 3,
      username: 'johndoe',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.isLeft() && result.value).toBeInstanceOf(
      InvalidCredentialsError,
    )
  })

  it('should be not able to register a user with no semester', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@alu.ufc.br',
      password: '123456',
      semester: 0,
      username: 'johndoe',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.isLeft() && result.value).toBeInstanceOf(
      InvalidCredentialsError,
    )
  })

  it('should be not able to register a user with no username', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@alu.ufc.br',
      password: '123456',
      semester: 3,
      username: '',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.isLeft() && result.value).toBeInstanceOf(
      InvalidCredentialsError,
    )
  })

  it('should be not able to register a user with an invalid email', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'invalid-email',
      password: '123456',
      semester: 3,
      username: 'johndoe',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.isLeft() && result.value).toBeInstanceOf(
      EmailBadFormattedError,
    )
  })

  it('should be not able to register a user with an non-institutional email', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
      semester: 3,
      username: 'johndoe',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.isLeft() && result.value).toBeInstanceOf(
      EmailBadFormattedError,
    )
  })

  it('should be not able to register a user with an existing email', async () => {
    const user = User.create({
      name: 'John Doe',
      email: 'johndoe@alu.ufc.br',
      passwordHash: passwordHash,
      semester: 3,
      username: 'johndoe',
    })

    await usersRepository.create(user)

    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@alu.ufc.br',
      password: 'password',
      semester: 3,
      username: 'johndoe',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.isLeft() && result.value).toBeInstanceOf(
      UserAlreadyExistsError,
    )
  })

  it('should be not able to register a user with an existing username', async () => {
    const user = User.create({
      name: 'John Doe',
      email: 'johndoe@alu.ufc.br',
      passwordHash: passwordHash,
      semester: 3,
      username: 'johndoe',
    })

    await usersRepository.create(user)

    const result = await sut.execute({
      name: 'John Doe',
      email: 'otherjohndoe@alu.ufc.br',
      password: 'password',
      semester: 3,
      username: 'johndoe',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.isLeft() && result.value).toBeInstanceOf(
      UserAlreadyExistsError,
    )
  })
})
