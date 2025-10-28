import type { TrailsRepository } from '@/domain/projects/application/repositories/trails-repository.ts'
import type { Trail } from '@/domain/projects/enterprise/entities/trail.ts'
import { UniqueEntityID } from '@/shared/kernel/unique-entity-id.ts'
import { makeTrail } from 'test/factories/make-trail.ts'
import { makeUser } from 'test/factories/make-user.ts'
import { InMemoryTrailsRepository } from 'test/repositories/trails-repository.ts'
import { InMemoryUsersRepository } from 'test/repositories/users-repository.ts'
import { StudentProfile } from '../../enterprise/entities/student-profile.ts'
import { User } from '../../enterprise/entities/user.ts'
import { Semester } from '../../enterprise/value-objects/semester.ts'
import type { UsersRepository } from '../repositories/users-repository.ts'
import { EditProfileUseCase } from './edit-profile.ts'

let usersRepository: UsersRepository
let trailsRepository: TrailsRepository

let student: User
let trail: Trail

let sut: EditProfileUseCase

describe('edit profile use case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    trailsRepository = new InMemoryTrailsRepository()

    const id = UniqueEntityID.create()

    student = await makeUser(
      {
        profile: StudentProfile.create(
          {
            semester: Semester.create(2).value as Semester,
          },
          id,
        ),
      },
      id,
    )
    trail = makeTrail()

    student.addTrailToProfile(trail.id)

    await trailsRepository.create(trail)
    await usersRepository.create(student)

    sut = new EditProfileUseCase(usersRepository, trailsRepository)
  })

  it('should be able to edit student profile', async () => {
    const result = await sut.execute({
      studentId: student.id.toString(),
      semester: 4,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toBeInstanceOf(User)
  })

  it('should be able to edit student trails', async () => {
    const newTrail = makeTrail({ name: 'Design' })

    await trailsRepository.create(newTrail)

    const result = await sut.execute({
      studentId: student.id.toString(),
      trailsIds: [newTrail.id.toString()],
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toBeInstanceOf(User)
  })

  it('should not be able to edit student profile if student does not exist', async () => {
    const result = await sut.execute({
      studentId: 'invalid-id',
      semester: 4,
    })

    expect(result.isLeft()).toBe(true)
  })

  it('should not be able to edit student trails if trail does not exist', async () => {
    const result = await sut.execute({
      studentId: student.id.toString(),
      trailsIds: ['invalid-id'],
    })

    expect(result.isLeft()).toBe(true)
  })
})
