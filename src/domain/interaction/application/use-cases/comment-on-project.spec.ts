import type { UsersRepository } from '@/domain/authentication/application/repositories/users-repository'
import type { User } from '@/domain/authentication/enterprise/entities/user'
import { makeProject } from 'test/factories/make-project'
import { makeUser } from 'test/factories/make-user'
import { InMemoryProjectsRepository } from 'test/repositories/projects-repository'
import { InMemoryUsersRepository } from 'test/repositories/users-repository'
import type { Project } from '../../../projects/enterprise/entities/project'
import { CommentOnProjectUseCase } from './comment-on-project'

import { InMemoryCommentsRepository } from 'test/repositories/comments-repository'
import type { CommentsRepository } from '@/domain/interaction/application/repositories/comments-repository'

let usersRepository: UsersRepository
let projectsRepository: InMemoryProjectsRepository
let commentsRepository: CommentsRepository

let author: User
let project: Project

let sut: CommentOnProjectUseCase

describe('comment on project use case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    projectsRepository = new InMemoryProjectsRepository()
    commentsRepository = new InMemoryCommentsRepository(usersRepository)

    author = await makeUser()
    project = makeProject()

    await usersRepository.create(author)
    await projectsRepository.create(project)

    sut = new CommentOnProjectUseCase(projectsRepository, usersRepository, commentsRepository)
  })

  it('should be able to comment on a project', async () => {
    const result = await sut.execute({
      authorId: author.id.toString(),
      projectId: project.id.toString(),
      content: 'Parabéns pelo projeto!',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual(
      expect.objectContaining({
        commentId: expect.any(String),
      }),
    )
  })
})
