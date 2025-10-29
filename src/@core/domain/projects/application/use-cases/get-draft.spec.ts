import type { UsersRepository } from '@/@core/domain/authentication/application/repositories/users-repository'
import type { User } from '@/@core/domain/authentication/enterprise/entities/user'
import type { ProjectsRepository } from '@/@core/domain/projects/application/repositories/projects-repository'
import type { Project } from '@/@core/domain/projects/enterprise/entities/project'
import { ForbiddenError } from '@/@shared/kernel/errors/forbidden.error'
import { ResourceNotFoundError } from '@/@shared/kernel/errors/resource-not-found.error'
import { makeProject } from 'test/factories/make-project'
import { makeUser } from 'test/factories/make-user'
import { InMemoryProjectsRepository } from 'test/repositories/projects-repository'
import { InMemoryUsersRepository } from 'test/repositories/users-repository'
import { GetDraftUseCase } from './get-draft'

let projectsRepository: ProjectsRepository
let studentsRepository: UsersRepository

let student: User
let draft: Project

let sut: GetDraftUseCase

describe('get draft use case', () => {
  beforeEach(async () => {
    projectsRepository = new InMemoryProjectsRepository()
    studentsRepository = new InMemoryUsersRepository()

    student = await makeUser()
    draft = makeProject({
      title: 'Design de Interação',
      authorId: student.id,
    })

    await studentsRepository.create(student)
    await projectsRepository.create(draft)

    sut = new GetDraftUseCase(projectsRepository, studentsRepository)
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
    const anotherStudent = await makeUser()

    await studentsRepository.create(anotherStudent)

    const response = await sut.execute({
      draftId: draft.id.toString(),
      authorId: anotherStudent.id.toString(),
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(ForbiddenError)
  })
})
