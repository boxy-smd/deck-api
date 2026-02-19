import { makeProject } from 'test/factories/make-project'
import { makeTrail } from 'test/factories/make-trail'
import { makeUser } from 'test/factories/make-user'
import { InMemoryProjectsRepository } from 'test/repositories/projects-repository'
import { InMemoryTrailsRepository } from 'test/repositories/trails-repository'
import { InMemoryUsersRepository } from 'test/repositories/users-repository'
import { ProjectStatus } from '@/@core/domain/projects/value-objects/project-status'
import { NonSelectableTrailError } from '../../trails/errors/non-selectable-trail.error'
import { SaveDraftUseCase } from './save-draft'

let inMemoryProjectsRepository: InMemoryProjectsRepository
let inMemoryTrailsRepository: InMemoryTrailsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let sut: SaveDraftUseCase

describe('Save Draft', () => {
  beforeEach(() => {
    inMemoryProjectsRepository = new InMemoryProjectsRepository()
    inMemoryTrailsRepository = new InMemoryTrailsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new SaveDraftUseCase(
      inMemoryProjectsRepository,
      inMemoryUsersRepository,
      inMemoryTrailsRepository,
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

  it('should not be able to save a draft selecting SMD trail', async () => {
    const student = await makeUser()
    await inMemoryUsersRepository.create(student)

    const smdTrail = makeTrail({ name: 'SMD' })
    await inMemoryTrailsRepository.create(smdTrail)

    const result = await sut.execute({
      title: 'Draft with SMD',
      description: 'Draft description',
      publishedYear: 2023,
      semester: 1,
      allowComments: true,
      authorId: student.id.toString(),
      trailsIds: [smdTrail.id.toString()],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.isLeft() && result.value).toBeInstanceOf(
      NonSelectableTrailError,
    )
  })
})
