import type { UsersRepository } from '@/@core/application/users/repositories/users-repository'
import type { Project } from '@/@core/domain/projects/entities/project'
import type { User } from '@/@core/domain/users/entities/user'
import { ForbiddenError } from '@/@shared/kernel/errors/forbidden.error'
import { ResourceNotFoundError } from '@/@shared/kernel/errors/resource-not-found.error'
import { makeProject } from 'test/factories/make-project'
import { makeUser } from 'test/factories/make-user'
import { InMemoryCommentsRepository } from 'test/repositories/comments-repository'
import { InMemoryProjectsRepository } from 'test/repositories/projects-repository'
import { InMemoryReportsRepository } from 'test/repositories/reports-repository'
import { InMemoryUsersRepository } from 'test/repositories/users-repository'
import type { Comment } from '../../../domain/interactions/entities/comment'
import type { ProjectsRepository } from '../../projects/application/repositories/projects-repository'
import type { CommentsRepository } from '../repositories/comments-repository'
import type { ReportsRepository } from '../repositories/reports-repository'
import { ReportCommentUseCase } from './report-comment'

let studentsRepository: UsersRepository
let projectsRepository: ProjectsRepository
let commentsRepository: CommentsRepository
let reportsRepository: ReportsRepository

let author: User
let project: Project
let comment: Comment

let sut: ReportCommentUseCase

describe('report comment use case', () => {
  beforeEach(async () => {
    studentsRepository = new InMemoryUsersRepository()
    projectsRepository = new InMemoryProjectsRepository()
    commentsRepository = new InMemoryCommentsRepository(studentsRepository)
    reportsRepository = new InMemoryReportsRepository()

    author = await makeUser()
    project = makeProject()
    comment = project.comment('Teste', author.id)

    await studentsRepository.create(author)
    await projectsRepository.create(project)
    await commentsRepository.create(comment)

    sut = new ReportCommentUseCase(
      studentsRepository,
      commentsRepository,
      reportsRepository,
    )
  })

  it('should be able to report a comment', async () => {
    const result = await sut.execute({
      content: 'This comment is inappropriate.',
      authorId: author.id.toString(),
      projectId: project.id.toString(),
      commentId: comment.id.toString(),
    })

    expect(result.isRight()).toBe(true)
  })

  it('should not be able to report a comment with an invalid author', async () => {
    const result = await sut.execute({
      content: 'This comment is inappropriate.',
      authorId: '',
      projectId: project.id.toString(),
      commentId: comment.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ForbiddenError)
  })

  it('should not be able to report a comment with an invalid comment id', async () => {
    const result = await sut.execute({
      content: 'This comment is inappropriate.',
      authorId: '123',
      projectId: project.id.toString(),
      commentId: 'invalid-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
