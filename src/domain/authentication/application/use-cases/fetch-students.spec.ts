import { UniqueEntityID } from '@/shared/kernel/unique-entity-id'
import { makeUser } from 'test/factories/make-user'
import { InMemoryUsersRepository } from 'test/repositories/users-repository'
import { StudentProfile } from '../../enterprise/entities/student-profile'
import type { User } from '../../enterprise/entities/user'
import { Semester } from '../../enterprise/value-objects/semester'
import { Username } from '../../enterprise/value-objects/username'
import type { UsersRepository } from '../repositories/users-repository'
import { FetchStudentsUseCase } from './fetch-students'

let usersRepository: UsersRepository

let student: User

let sut: FetchStudentsUseCase

describe('fetch students use case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()

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

    sut = new FetchStudentsUseCase(usersRepository)
  })

  it('should be able to fetch students', async () => {
    await usersRepository.create(student)

    const result = await sut.execute({})

    expect(result).toBeInstanceOf(Array<User>)
    expect(result).toHaveLength(1)
  })

  it('should be able to fetch students with name', async () => {
    const otherStudent = await makeUser({
      name: 'Other Student',
    })

    await usersRepository.create(otherStudent)
    await usersRepository.create(student)

    const result = await sut.execute({ name: student.name })

    expect(result).toBeInstanceOf(Array<User>)
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

    expect(result).toBeInstanceOf(Array<User>)
    expect(result).toHaveLength(1)
    expect(result[0].username).toEqual(student.username)
  })

  it('should be able to fetch students with empty array', async () => {
    const result = await sut.execute({})

    expect(result).toEqual([])
  })
})
