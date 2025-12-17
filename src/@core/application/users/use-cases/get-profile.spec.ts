import { ResourceNotFoundError } from '@/@shared/kernel/errors/resource-not-found.error'
import { makeUser } from 'test/factories/make-user'
import { InMemoryTrailsRepository } from 'test/repositories/trails-repository'
import { InMemoryUsersRepository } from 'test/repositories/users-repository'
import type { User } from '../../../domain/users/entities/user'
import type { TrailsRepository } from '../../trails/repositories/trails-repository'
import type { UsersRepository } from '../repositories/users-repository'
import { GetProfileUseCase } from './get-profile'

let usersRepository: UsersRepository
let trailsRepository: TrailsRepository

let student: User

let sut: GetProfileUseCase

describe('get profile use case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    trailsRepository = new InMemoryTrailsRepository()

    student = await makeUser()

    sut = new GetProfileUseCase(usersRepository, trailsRepository)
  })

  it('should be able to get a student profile', async () => {
    await usersRepository.create(student)

    const result = await sut.execute({
      username: student.username.value,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: student.name,
        username: student.username.value,
        email: student.email.value,
      }),
    )
  })

  it('should not be able to get a student with no id', async () => {
    const result = await sut.execute({
      username: '',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to get a student with no student', async () => {
    const result = await sut.execute({
      username: 'invalid-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
