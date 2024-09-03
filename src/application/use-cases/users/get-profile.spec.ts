import { beforeEach, describe, expect, it } from 'vitest'

import { User } from '@/domain/entities/user.entity.ts'
import { Base64Encrypter } from '@/infra/cryptography/base64-encrypter.ts'
import { InMemoryUsersRepository } from '@/infra/database/in-memory/repositories/users-repository.ts'
import { UserNotFoundError } from './errors/user-not-found.error.ts'
import { GetProfileUseCase } from './get-profile.ts'

let usersRepository: InMemoryUsersRepository
let sut: GetProfileUseCase
let passwordHash: string
let user: User

describe('get profile use case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    const encrypter = new Base64Encrypter()
    passwordHash = await User.hashPassword('123456', encrypter)
    sut = new GetProfileUseCase(usersRepository)

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

  it('should be able to get a user profile', async () => {
    await usersRepository.create(user)

    const result = await sut.execute({
      userId: user.id,
    })

    expect(result.isRight()).toBe(true)
    expect(result.isRight() && result.value).toBeInstanceOf(User)
  })

  it('should not be able to get a user with no id', async () => {
    const result = await sut.execute({
      userId: '',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.isLeft() && result.value).toBeInstanceOf(UserNotFoundError)
  })

  it('should not be able to get a user with no user', async () => {
    const result = await sut.execute({
      userId: 'invalid-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.isLeft() && result.value).toBeInstanceOf(UserNotFoundError)
  })
})
