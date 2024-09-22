import { ForbiddenError } from '@/core/errors/forbidden.error.ts'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error.ts'
import { makeStudent } from 'test/factories/make-student.ts'
import { makeTrail } from 'test/factories/make-trail.ts'
import { InMemoryDraftsRepository } from 'test/repositories/drafts-repository.ts'
import { InMemoryProfessorsRepository } from 'test/repositories/professors-repository.ts'
import { InMemoryStudentsRepository } from 'test/repositories/students-repository.ts'
import { InMemorySubjectsRepository } from 'test/repositories/subjects-repository.ts'
import { InMemoryTrailsRepository } from 'test/repositories/trails-repository.ts'
import { Draft } from '../../enterprise/entities/draft.ts'
import type { Student } from '../../enterprise/entities/student.ts'
import type { Trail } from '../../enterprise/entities/trail.ts'
import { EditDraftUseCase } from './edit-draft.ts'

let draftsRepository: InMemoryDraftsRepository
let studentsRepository: InMemoryStudentsRepository
let subjectsRepository: InMemorySubjectsRepository
let trailsRepository: InMemoryTrailsRepository
let professorsRepository: InMemoryProfessorsRepository

let author: Student
let trail: Trail
let draft: Draft

let sut: EditDraftUseCase

describe('edit draft use case', () => {
  beforeEach(async () => {
    studentsRepository = new InMemoryStudentsRepository()
    subjectsRepository = new InMemorySubjectsRepository()
    trailsRepository = new InMemoryTrailsRepository()
    professorsRepository = new InMemoryProfessorsRepository()
    draftsRepository = new InMemoryDraftsRepository()

    author = await makeStudent()
    trail = makeTrail()
    draft = Draft.create({
      title: 'Draft Title',
      authorId: author.id,
    })

    await studentsRepository.create(author)
    await trailsRepository.create(trail)
    await draftsRepository.create(draft)

    sut = new EditDraftUseCase(
      draftsRepository,
      studentsRepository,
      subjectsRepository,
      trailsRepository,
      professorsRepository,
    )
  })

  it('should be able to edit a draft', async () => {
    const result = await sut.execute({
      authorId: author.id.toString(),
      draftId: draft.id.toString(),
      title: 'New Draft Title',
    })

    expect(result.isRight()).toBe(true)
    expect(result.isRight() && result.value.title).toBe('New Draft Title')
  })

  it('should not be able to edit a draft without being logged in', async () => {
    const result = await sut.execute({
      authorId: '',
      draftId: draft.id.toString(),
      title: 'New Draft Title',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.isLeft() && result.value).toBeInstanceOf(ForbiddenError)
  })

  it('should not be able to edit a draft that does not exist', async () => {
    const result = await sut.execute({
      authorId: author.id.toString(),
      draftId: 'invalid-id',
      title: 'New Draft Title',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.isLeft() && result.value).toBeInstanceOf(
      ResourceNotFoundError,
    )
  })

  it('should not be able to edit a draft from another author', async () => {
    const anotherAuthor = await makeStudent()
    await studentsRepository.create(anotherAuthor)

    const result = await sut.execute({
      authorId: anotherAuthor.id.toString(),
      draftId: draft.id.toString(),
      title: 'New Draft Title',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.isLeft() && result.value).toBeInstanceOf(ForbiddenError)
  })
})
