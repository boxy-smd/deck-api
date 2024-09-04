import { makeStudentTrail } from 'test/factories/make-student-trail.ts'
import { makeStudent } from 'test/factories/make-student.ts'
import { makeTrail } from 'test/factories/make-trail.ts'
import { InMemoryStudentTrailsRepository } from 'test/repositories/student-trails-repository.ts'
import { InMemoryStudentsRepository } from 'test/repositories/students-repository.ts'
import { InMemoryTrailsRepository } from 'test/repositories/trails-repository.ts'
import { StudentTrailList } from '../../enterprise/entities/student-trail-list.ts'
import type { StudentTrail } from '../../enterprise/entities/student-trail.ts'
import { Student } from '../../enterprise/entities/student.ts'
import type { Trail } from '../../enterprise/entities/trail.ts'
import { UpdateProfileUseCase } from './update-profile.ts'

let studentsRepository: InMemoryStudentsRepository
let trailsRepository: InMemoryTrailsRepository
let studentTrailsRepository: InMemoryStudentTrailsRepository
let student: Student
let studentTrail: StudentTrail
let trail: Trail

let sut: UpdateProfileUseCase

describe('update profile use case', () => {
  beforeEach(async () => {
    studentsRepository = new InMemoryStudentsRepository()
    trailsRepository = new InMemoryTrailsRepository()
    studentTrailsRepository = new InMemoryStudentTrailsRepository()

    student = await makeStudent()
    trail = makeTrail()

    studentTrail = makeStudentTrail({
      studentId: student.id,
      trailId: trail.id,
    })

    student.trails = new StudentTrailList([studentTrail])

    sut = new UpdateProfileUseCase(
      studentsRepository,
      trailsRepository,
      studentTrailsRepository,
    )
  })

  it('should update student profile', async () => {
    await studentsRepository.create(student)

    const result = await sut.execute({
      studentId: student.id.toString(),
      name: 'Jane Doe',
      about: 'I am a student at UFC',
      semester: 3,
      profileUrl: 'https://boxy.com/test-2.png',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toBeInstanceOf(Student)
  })

  it('should update student trails', async () => {
    await studentsRepository.create(student)

    const newTrail = makeTrail({ name: 'Design' })

    await trailsRepository.create(newTrail)

    const result = await sut.execute({
      studentId: student.id.toString(),
      trailsIds: [newTrail.id.toString()],
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toBeInstanceOf(Student)
  })

  it('should not update student profile if student does not exist', async () => {
    const result = await sut.execute({
      studentId: 'invalid-id',
      name: 'Jane Doe',
      about: 'I am a student at UFC',
      semester: 3,
      profileUrl: 'https://boxy.com/test-2.png',
    })

    expect(result.isLeft()).toBe(true)
  })

  it('should not update student trails if trail does not exist', async () => {
    const result = await sut.execute({
      studentId: student.id.toString(),
      trailsIds: ['invalid-id'],
    })

    expect(result.isLeft()).toBe(true)
  })
})
