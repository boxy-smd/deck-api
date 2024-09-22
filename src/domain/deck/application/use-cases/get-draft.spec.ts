import { ForbiddenError } from '@/core/errors/forbidden.error.ts'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error.ts'
import { makeStudent } from 'test/factories/make-student.ts'
import { InMemoryDraftsRepository } from 'test/repositories/drafts-repository.ts'
import { InMemoryStudentsRepository } from 'test/repositories/students-repository.ts'
import { Draft } from '../../enterprise/entities/draft.ts'
import type { Student } from '../../enterprise/entities/student.ts'
import { GetDraftUseCase } from './get-draft.ts'

let draftsRepository: InMemoryDraftsRepository
let studentsRepository: InMemoryStudentsRepository

let student: Student
let draft: Draft

let sut: GetDraftUseCase

describe('get draft use case', () => {
  beforeEach(async () => {
    draftsRepository = new InMemoryDraftsRepository()
    studentsRepository = new InMemoryStudentsRepository()

    student = await makeStudent()
    draft = Draft.create({
      title: 'Design de Interação',
      authorId: student.id,
    })

    await studentsRepository.create(student)
    await draftsRepository.create(draft)

    sut = new GetDraftUseCase(draftsRepository, studentsRepository)
  })

  it('should be able to get a draft', async () => {
    const response = await sut.execute({
      draftId: draft.id.toString(),
      authorId: student.id.toString(),
    })

    expect(response.isRight()).toBe(true)
    expect(response.value).toEqual(draft)
  })

  it('should not be able to get a draft without an author', async () => {
    const response = await sut.execute({
      draftId: draft.id.toString(),
      authorId: '',
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(ForbiddenError)
  })

  it('should not be able to get a draft with an invalid author', async () => {
    const response = await sut.execute({
      draftId: draft.id.toString(),
      authorId: 'invalid-author-id',
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to get a draft with an invalid draft id', async () => {
    const response = await sut.execute({
      draftId: 'invalid-draft-id',
      authorId: student.id.toString(),
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to get a draft of another author', async () => {
    const anotherStudent = await makeStudent()

    await studentsRepository.create(anotherStudent)

    const response = await sut.execute({
      draftId: draft.id.toString(),
      authorId: anotherStudent.id.toString(),
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(ForbiddenError)
  })
})
