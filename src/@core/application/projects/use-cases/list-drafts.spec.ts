import { ProjectStatus } from '@/@core/domain/projects/value-objects/project-status'
import { UniqueEntityID } from '@/@shared/kernel/kernel/unique-entity-id'
import { makeProject } from 'test/factories/make-project'
import { InMemoryProjectsRepository } from 'test/repositories/projects-repository'
import { ListDraftsUseCase } from './list-drafts'

let inMemoryProjectsRepository: InMemoryProjectsRepository
let sut: ListDraftsUseCase

describe('List Drafts', () => {
  beforeEach(() => {
    inMemoryProjectsRepository = new InMemoryProjectsRepository()
    sut = new ListDraftsUseCase(inMemoryProjectsRepository)
  })

  it('should be able to list drafts from a user', async () => {
    const authorId = new UniqueEntityID('author-1')

    await inMemoryProjectsRepository.create(
      makeProject({
        authorId,
        status: ProjectStatus.DRAFT,
        title: 'Draft 1',
      }),
    )

    await inMemoryProjectsRepository.create(
      makeProject({
        authorId,
        status: ProjectStatus.PUBLISHED,
        title: 'Published Project',
      }),
    )

    await inMemoryProjectsRepository.create(
      makeProject({
        authorId,
        status: ProjectStatus.DRAFT,
        title: 'Draft 2',
      }),
    )

    const result = await sut.execute({
      authorId: authorId.toString(),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.drafts).toHaveLength(2)
      expect(result.value.drafts).toEqual([
        expect.objectContaining({ title: 'Draft 1' }),
        expect.objectContaining({ title: 'Draft 2' }),
      ])
    }
  })
})
