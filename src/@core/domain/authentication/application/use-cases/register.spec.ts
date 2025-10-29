import { ResourceAlreadyExistsError } from '@/@shared/kernel/errors/resource-already-exists.error'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeUser } from 'test/factories/make-user'
import { InMemoryTrailsRepository } from 'test/repositories/trails-repository'
import { InMemoryUsersRepository } from 'test/repositories/users-repository'
import { User } from '../../enterprise/entities/user'
import { RegisterUseCase } from './register'

let usersRepository: InMemoryUsersRepository
let trailsRepository: InMemoryTrailsRepository
let hasher: FakeHasher

let user: User

let sut: RegisterUseCase

describe('register use case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    trailsRepository = new InMemoryTrailsRepository()
    hasher = new FakeHasher()

    user = await makeUser()

    sut = new RegisterUseCase(usersRepository, trailsRepository, hasher)
  })

  it('should be able to register a user', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      username: 'johndoe',
      email: 'johndoe@alu.ufc.br',
      password: '123456',
      semester: 1,
      trailsIds: [],
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toBeInstanceOf(User)
  })

  it('should not be able to register a user with an existing email', async () => {
    await usersRepository.create(user)

    const result = await sut.execute({
      name: 'John Doe',
      username: 'johndoe',
      email: user.email.value,
      password: '123456',
      semester: 1,
      trailsIds: [],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceAlreadyExistsError)
  })

  it('should not be able to register a user with an existing username', async () => {
    await usersRepository.create(user)

    const result = await sut.execute({
      name: 'John Doe',
      username: user.username.value,
      email: 'johndoe@alu.ufc.br',
      password: '123456',
      semester: 1,
      trailsIds: [],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceAlreadyExistsError)
  })
})
