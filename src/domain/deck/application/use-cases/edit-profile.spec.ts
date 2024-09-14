import { makeStudent } from 'test/factories/make-student.ts'
import { makeTrail } from 'test/factories/make-trail.ts'
import { InMemoryStudentsRepository } from 'test/repositories/students-repository.ts'
import { InMemoryTrailsRepository } from 'test/repositories/trails-repository.ts'
import type { Student } from '../../enterprise/entities/student.ts'
import type { Trail } from '../../enterprise/entities/trail.ts'
import { StudentProfile } from '../../enterprise/entities/value-objects/student-profile.ts'
import { EditProfileUseCase } from './edit-profile.ts'

let studentsRepository: InMemoryStudentsRepository
let trailsRepository: InMemoryTrailsRepository

let student: Student
let trail: Trail

let sut: EditProfileUseCase

describe('edit profile use case', () => {
  beforeEach(async () => {
    trailsRepository = new InMemoryTrailsRepository()

    studentsRepository = new InMemoryStudentsRepository()

    student = await makeStudent()
    trail = makeTrail()

    student.trails = [trail]

    await studentsRepository.create(student)

    sut = new EditProfileUseCase(studentsRepository, trailsRepository)
  })

  it('should be able to edit student profile', async () => {
    const result = await sut.execute({
      studentId: student.id.toString(),
      semester: 4,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toBeInstanceOf(StudentProfile)
  })

  it('should be able to edit student trails', async () => {
    const newTrail = makeTrail({ name: 'Design' })

    await trailsRepository.create(newTrail)

    const result = await sut.execute({
      studentId: student.id.toString(),
      trailsIds: [newTrail.id.toString()],
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toBeInstanceOf(StudentProfile)
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
