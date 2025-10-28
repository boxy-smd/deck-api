import type { UsersRepository } from '@/domain/authentication/application/repositories/users-repository.ts'
import type { User } from '@/domain/authentication/enterprise/entities/user.ts'
import { makeProject } from 'test/factories/make-project.ts'
import { makeUser } from 'test/factories/make-user.ts'
import { InMemoryProjectsRepository } from 'test/repositories/projects-repository.ts'
import { InMemoryUsersRepository } from 'test/repositories/users-repository.ts'
import type { Project } from '../../../projects/enterprise/entities/project.ts'
import { CommentOnProjectUseCase } from './comment-on-project.ts'

let usersRepository: UsersRepository
let projectsRepository: InMemoryProjectsRepository

let author: User
let project: Project

let sut: CommentOnProjectUseCase

describe('comment on project use case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    projectsRepository = new InMemoryProjectsRepository()

    author = await makeUser()
    project = makeProject()

    await usersRepository.create(author)
    await projectsRepository.create(project)

    sut = new CommentOnProjectUseCase(projectsRepository, usersRepository)
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
