import { makeProject } from 'test/factories/make-project'
import { makeUser } from 'test/factories/make-user'
import { InMemoryCommentsRepository } from 'test/repositories/comments-repository'
import { InMemoryProjectsRepository } from 'test/repositories/projects-repository'
import { InMemoryUsersRepository } from 'test/repositories/users-repository'
import type { UsersRepository } from '@/@core/application/users/repositories/users-repository'
import type { Project } from '@/@core/domain/projects/entities/project'
import type { User } from '@/@core/domain/users/entities/user'
import type { ProjectsRepository } from '../../projects/repositories/projects-repository'
import type { CommentsRepository } from '../repositories/comments-repository'
import { CommentOnProjectUseCase } from './comment-on-project'

let usersRepository: UsersRepository
let projectsRepository: ProjectsRepository
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
    project.post() // Publicar projeto para permitir comentários

    await usersRepository.create(author)
    await projectsRepository.create(project)

    sut = new CommentOnProjectUseCase(
      projectsRepository,
      usersRepository,
      commentsRepository,
    )
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
