import { ResourceNotFoundError } from '@/shared/errors/resource-not-found.error.ts'
import { makeUser } from 'test/factories/make-user.ts'
import { InMemoryUsersRepository } from 'test/repositories/users-repository.ts'
import { User } from '../../enterprise/entities/user.ts'
import type { UsersRepository } from '../repositories/users-repository.ts'
import { GetProfileUseCase } from './get-profile.ts'

let usersRepository: UsersRepository

let student: User

let sut: GetProfileUseCase

describe('get profile use case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()

    student = await makeUser()

    sut = new GetProfileUseCase(usersRepository)
  })

  it('should be able to get a student profile', async () => {
    await usersRepository.create(student)

    const result = await sut.execute({
      username: student.username.value,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toBeInstanceOf(User)
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
