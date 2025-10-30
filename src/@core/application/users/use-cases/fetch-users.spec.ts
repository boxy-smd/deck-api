import { UniqueEntityID } from '@/@shared/kernel/kernel/unique-entity-id'
import { makeUser } from 'test/factories/make-user'
import { InMemoryTrailsRepository } from 'test/repositories/trails-repository'
import { InMemoryUsersRepository } from 'test/repositories/users-repository'
import { StudentProfile } from '../../../domain/users/entities/student-profile'
import type { User } from '../../../domain/users/entities/user'
import { Semester } from '../../../domain/users/value-objects/semester'
import { Username } from '../../../domain/users/value-objects/username'
import type { TrailsRepository } from '../../projects/repositories/trails-repository'
import type { UsersRepository } from '../repositories/users-repository'
import { FetchUsersUseCase } from './fetch-users'

let usersRepository: UsersRepository
let trailsRepository: TrailsRepository

let student: User

let sut: FetchUsersUseCase

describe('fetch students use case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    trailsRepository = new InMemoryTrailsRepository()

    const id = UniqueEntityID.create()

    student = await makeUser(
      {
        profile: StudentProfile.create(
          { semester: Semester.create(1).value as Semester },
          id,
        ),
      },
      id,
    )

    sut = new FetchUsersUseCase(usersRepository, trailsRepository)
  })

  it('should be able to fetch students', async () => {
    await usersRepository.create(student)

    const result = await sut.execute({})

    expect(result).toBeInstanceOf(Array)
    expect(result).toHaveLength(1)
    expect(result[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: student.name,
        username: student.username.value,
      }),
    )
  })

  it('should be able to fetch students with name', async () => {
    const otherStudent = await makeUser({
      name: 'Other Student',
    })

    await usersRepository.create(otherStudent)
    await usersRepository.create(student)

    const result = await sut.execute({ name: student.name })

    expect(result).toBeInstanceOf(Array)
    expect(result).toHaveLength(1)
    expect(result[0].name).toEqual(student.name)
  })

  it('should be able to fetch students with username', async () => {
    const otherId = UniqueEntityID.create()

    const otherStudent = await makeUser(
      {
        username: Username.create('other_student').value as Username,
        profile: StudentProfile.create(
          { semester: Semester.create(2).value as Semester },
          otherId,
        ),
      },
      otherId,
    )

    await usersRepository.create(otherStudent)
    await usersRepository.create(student)

    const result = await sut.execute({ name: student.username.value })

    expect(result).toBeInstanceOf(Array)
    expect(result).toHaveLength(1)
    expect(result[0].username).toEqual(student.username.value)
  })

  it('should be able to fetch students with empty array', async () => {
    const result = await sut.execute({})

    expect(result).toEqual([])
  })
})
