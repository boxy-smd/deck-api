import type { UsersRepository } from '@/domain/authentication/application/repositories/users-repository'
import type { User } from '@/domain/authentication/enterprise/entities/user'
import type { CommentsRepository } from '@/domain/interaction/application/repositories/comments-repository'
import type { ProjectsRepository } from '@/domain/projects/application/repositories/projects-repository'
import type { TrailsRepository } from '@/domain/projects/application/repositories/trails-repository'
import { ForbiddenError } from '@/shared/errors/forbidden.error'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found.error'
import { makeProject } from 'test/factories/make-project'
import { makeTrail } from 'test/factories/make-trail'
import { makeUser } from 'test/factories/make-user'
import { InMemoryCommentsRepository } from 'test/repositories/comments-repository'
import { InMemoryProjectsRepository } from 'test/repositories/projects-repository'
import { InMemoryTrailsRepository } from 'test/repositories/trails-repository'
import { InMemoryUsersRepository } from 'test/repositories/users-repository'
import type { Comment } from '../../../interaction/enterprise/entities/comment'
import type { Project } from '../../../projects/enterprise/entities/project'
import { DeleteCommentUseCase } from './delete-comment'

let usersRepository: UsersRepository
let projectsRepository: ProjectsRepository
let trailsRepository: TrailsRepository
let commentsRepository: CommentsRepository

let author: User
let project: Project
let comment: Comment

let sut: DeleteCommentUseCase

describe('delete comment use case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    trailsRepository = new InMemoryTrailsRepository()
    projectsRepository = new InMemoryProjectsRepository()
    commentsRepository = new InMemoryCommentsRepository(usersRepository)

    author = await makeUser()
    const trail = makeTrail()
    project = makeProject({
      authorId: author.id,
      trails: new Set([trail.id]),
    })
    comment = project.comment('Parabéns pelo projeto!', author.id)

    await usersRepository.create(author)
    await trailsRepository.create(trail)
    await projectsRepository.create(project)
    await commentsRepository.create(comment)

    sut = new DeleteCommentUseCase(commentsRepository, usersRepository)
  })

  it('should be able to delete a comment', async () => {
    const response = await sut.execute({
      projectId: project.id.toString(),
      authorId: author.id.toString(),
      commentId: comment.id.toString(),
    })

    expect(response.isRight()).toBe(true)
    expect(response.value).toBeUndefined()
  })

  it('should not be able to delete a comment if the author is not logged in', async () => {
    const response = await sut.execute({
      projectId: project.id.toString(),
      authorId: '',
      commentId: comment.id.toString(),
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(ForbiddenError)
  })

  it('should not be able to delete a comment if the author does not exist', async () => {
    const response = await sut.execute({
      projectId: project.id.toString(),
      authorId: 'invalid-author-id',
      commentId: comment.id.toString(),
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to delete a comment if the comment does not exist', async () => {
    const response = await sut.execute({
      projectId: project.id.toString(),
      authorId: author.id.toString(),
      commentId: 'invalid-comment-id',
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to delete a comment if the project does not exist', async () => {
    await projectsRepository.deleteById(project.id.toString())

    const response = await sut.execute({
      projectId: 'invalid-project-id',
      authorId: author.id.toString(),
      commentId: comment.id.toString(),
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
