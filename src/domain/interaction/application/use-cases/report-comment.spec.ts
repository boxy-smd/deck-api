import type { UsersRepository } from '@/domain/authentication/application/repositories/users-repository.ts'
import type { User } from '@/domain/authentication/enterprise/entities/user.ts'
import type { CommentsRepository } from '@/domain/interaction/application/repositories/comments-repository.ts'
import type { ReportsRepository } from '@/domain/interaction/application/repositories/reports-repository.ts'
import type { ProjectsRepository } from '@/domain/projects/application/repositories/projects-repository.ts'
import type { Project } from '@/domain/projects/enterprise/entities/project.ts'
import { ForbiddenError } from '@/shared/errors/forbidden.error.ts'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found.error.ts'
import { makeProject } from 'test/factories/make-project.ts'
import { makeUser } from 'test/factories/make-user.ts'
import { InMemoryCommentsRepository } from 'test/repositories/comments-repository.ts'
import { InMemoryProjectsRepository } from 'test/repositories/projects-repository.ts'
import { InMemoryReportsRepository } from 'test/repositories/reports-repository.ts'
import { InMemoryUsersRepository } from 'test/repositories/users-repository.ts'
import type { Comment } from '../../enterprise/entities/comment.ts'
import { ReportCommentUseCase } from './report-comment.ts'

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

    sut = new ReportCommentUseCase(studentsRepository, commentsRepository, reportsRepository)
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
