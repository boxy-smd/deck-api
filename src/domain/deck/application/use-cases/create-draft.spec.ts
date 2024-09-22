import { ForbiddenError } from '@/core/errors/forbidden.error.ts'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error.ts'
import { makeStudent } from 'test/factories/make-student.ts'
import { makeTrail } from 'test/factories/make-trail.ts'
import { InMemoryDraftsRepository } from 'test/repositories/drafts-repository.ts'
import { InMemoryProfessorsRepository } from 'test/repositories/professors-repository.ts'
import { InMemoryStudentsRepository } from 'test/repositories/students-repository.ts'
import { InMemorySubjectsRepository } from 'test/repositories/subjects-repository.ts'
import { InMemoryTrailsRepository } from 'test/repositories/trails-repository.ts'
import type { Student } from '../../enterprise/entities/student.ts'
import type { Trail } from '../../enterprise/entities/trail.ts'
import { CreateDraftUseCase } from './create-draft.ts'

let draftsRepository: InMemoryDraftsRepository
let studentsRepository: InMemoryStudentsRepository
let subjectsRepository: InMemorySubjectsRepository
let trailsRepository: InMemoryTrailsRepository
let professorsRepository: InMemoryProfessorsRepository

let author: Student
let trail: Trail

let sut: CreateDraftUseCase

describe('create draft use case', () => {
  beforeEach(async () => {
    draftsRepository = new InMemoryDraftsRepository()
    studentsRepository = new InMemoryStudentsRepository()
    subjectsRepository = new InMemorySubjectsRepository()
    trailsRepository = new InMemoryTrailsRepository()
    professorsRepository = new InMemoryProfessorsRepository()

    author = await makeStudent()
    trail = makeTrail()

    sut = new CreateDraftUseCase(
      draftsRepository,
      studentsRepository,
      subjectsRepository,
      trailsRepository,
      professorsRepository,
    )
  })

  it('should be able to create a draft', async () => {
    await studentsRepository.create(author)
    await trailsRepository.create(trail)

    const result = await sut.execute({
      title: 'Draft Title',
      authorId: author.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      draftId: expect.any(String),
    })
  })

  it('should not be able to create a draft without a title', async () => {
    await studentsRepository.create(author)

    const result = await sut.execute({
      title: '',
      authorId: author.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ForbiddenError)
  })

  it('should not be able to create a draft with an invalid author', async () => {
    await trailsRepository.create(trail)

    const result = await sut.execute({
      title: 'Draft Title',
      authorId: 'invalid-author-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to create a draft with an invalid trail', async () => {
    await studentsRepository.create(author)

    const result = await sut.execute({
      title: 'Draft Title',
      authorId: author.id.toString(),
      trailsIds: ['invalid-trail-id'],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
