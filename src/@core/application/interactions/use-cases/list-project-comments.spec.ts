import { ResourceNotFoundError } from '@/@shared/kernel/errors/resource-not-found.error'
import { makeComment } from 'test/factories/make-comment'
import { makeProject } from 'test/factories/make-project'
import { makeUser } from 'test/factories/make-user'
import { InMemoryCommentsRepository } from 'test/repositories/comments-repository'
import { InMemoryProjectsRepository } from 'test/repositories/projects-repository'
import { InMemoryUsersRepository } from 'test/repositories/users-repository'
import type { ProjectsRepository } from '../../projects/application/repositories/projects-repository'
import type { UsersRepository } from '../../users/repositories/users-repository'
import type { CommentsRepository } from '../repositories/comments-repository'
import { ListProjectCommentsUseCase } from './list-project-comments'

let commentsRepository: CommentsRepository
let projectsRepository: ProjectsRepository
let usersRepository: UsersRepository
let sut: ListProjectCommentsUseCase

describe('list project comments use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    commentsRepository = new InMemoryCommentsRepository(usersRepository)
    projectsRepository = new InMemoryProjectsRepository()
    sut = new ListProjectCommentsUseCase(projectsRepository, commentsRepository)
  })

  it('should be able to list project comments', async () => {
    const author = await makeUser()
    const project = makeProject()

    await usersRepository.create(author)
    await projectsRepository.create(project)

    const comment1 = makeComment({
      projectId: project.id,
      authorId: author.id,
    })
    const comment2 = makeComment({
      projectId: project.id,
      authorId: author.id,
    })
    const comment3 = makeComment({
      projectId: project.id,
      authorId: author.id,
    })

    await commentsRepository.create(comment1)
    await commentsRepository.create(comment2)
    await commentsRepository.create(comment3)

    const result = await sut.execute({
      projectId: project.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.comments).toHaveLength(3)
    }
  })

  it('should not be able to list comments from non-existing project', async () => {
    const result = await sut.execute({
      projectId: 'non-existing-project-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should return empty list when project has no comments', async () => {
    const project = makeProject()
    await projectsRepository.create(project)

    const result = await sut.execute({
      projectId: project.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.comments).toHaveLength(0)
    }
  })
})
