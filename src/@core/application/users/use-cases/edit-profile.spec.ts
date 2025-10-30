import type { Trail } from '@/@core/domain/projects/entities/trail'
import { UniqueEntityID } from '@/@shared/kernel/kernel/unique-entity-id'
import { makeTrail } from 'test/factories/make-trail'
import { makeUser } from 'test/factories/make-user'
import { InMemoryTrailsRepository } from 'test/repositories/trails-repository'
import { InMemoryUsersRepository } from 'test/repositories/users-repository'
import { StudentProfile } from '../../../domain/users/entities/student-profile'
import type { User } from '../../../domain/users/entities/user'
import { Semester } from '../../../domain/users/value-objects/semester'
import type { TrailsRepository } from '../../projects/repositories/trails-repository'
import type { UsersRepository } from '../repositories/users-repository'
import { EditProfileUseCase } from './edit-profile'

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
      userId: student.id.toString(),
      semester: 4,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.semester).toBe(4)
    }
  })

  it('should be able to edit student trails', async () => {
    const newTrail = makeTrail({ name: 'Design' })

    await trailsRepository.create(newTrail)

    const result = await sut.execute({
      userId: student.id.toString(),
      trailsIds: [newTrail.id.toString()],
    })

    expect(result.isRight()).toBe(true)

    // Verify the user was saved with the new trail
    const updatedUser = await usersRepository.findById(student.id.toString())
    expect(updatedUser?.profile?.trailsIds).toHaveLength(2)
  })

  it('should not be able to edit student profile if student does not exist', async () => {
    const result = await sut.execute({
      userId: 'invalid-id',
      semester: 4,
    })

    expect(result.isLeft()).toBe(true)
  })

  it('should not be able to edit student trails if trail does not exist', async () => {
    const result = await sut.execute({
      userId: student.id.toString(),
      trailsIds: ['invalid-id'],
    })

    expect(result.isLeft()).toBe(true)
  })
})
