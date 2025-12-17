import { InMemoryProjectsRepository } from 'test/repositories/projects-repository'
import { InMemoryUsersRepository } from 'test/repositories/users-repository'
import { SaveDraftUseCase } from './save-draft'
import { makeUser } from 'test/factories/make-user'
import { makeProject } from 'test/factories/make-project'
import { ProjectStatus } from '@/@core/domain/projects/value-objects/project-status'

let inMemoryProjectsRepository: InMemoryProjectsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let sut: SaveDraftUseCase

describe('Save Draft', () => {
  beforeEach(() => {
    inMemoryProjectsRepository = new InMemoryProjectsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new SaveDraftUseCase(
      inMemoryProjectsRepository,
      inMemoryUsersRepository,
    )
  })

  it('should be able to save a new draft', async () => {
    const student = await makeUser()
    await inMemoryUsersRepository.create(student)

    const result = await sut.execute({
      title: 'New Project Draft',
      description: 'Draft description',
      publishedYear: 2023,
      semester: 1,
      allowComments: true,
      authorId: student.id.toString(),
      trailsIds: [],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryProjectsRepository.items[0]).toEqual(
      expect.objectContaining({
        title: 'New Project Draft',
        status: ProjectStatus.DRAFT,
      }),
    )
  })

  it('should be able to update an existing draft', async () => {
    const student = await makeUser()
    await inMemoryUsersRepository.create(student)

    const draft = makeProject({
      authorId: student.id,
      status: ProjectStatus.DRAFT,
    })
    await inMemoryProjectsRepository.create(draft)

    const result = await sut.execute({
      title: 'Updated Draft Title',
      description: 'Updated description',
      publishedYear: 2023,
      semester: 1,
      allowComments: true,
      authorId: student.id.toString(),
      trailsIds: [],
      draftId: draft.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryProjectsRepository.items[0].title).toEqual(
      'Updated Draft Title',
    )
  })

  it('should not be able to update a draft from another user', async () => {
    const student = await makeUser()
    await inMemoryUsersRepository.create(student)

    const anotherStudent = await makeUser()
    await inMemoryUsersRepository.create(anotherStudent)

    const draft = makeProject({
      authorId: anotherStudent.id,
      status: ProjectStatus.DRAFT,
    })
    await inMemoryProjectsRepository.create(draft)

    const result = await sut.execute({
      title: 'Updated Draft Title',
      description: 'Updated description',
      publishedYear: 2023,
      semester: 1,
      allowComments: true,
      authorId: student.id.toString(), // Trying to update with different author
      trailsIds: [],
      draftId: draft.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
  })
})
