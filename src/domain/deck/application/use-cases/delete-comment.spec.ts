import { ForbiddenError } from '@/core/errors/forbidden.error.ts'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error.ts'
import { makeComment } from 'test/factories/make-comment.ts'
import { makeProject } from 'test/factories/make-project.ts'
import { makeStudent } from 'test/factories/make-student.ts'
import { makeTrail } from 'test/factories/make-trail.ts'
import { InMemoryCommentsRepository } from 'test/repositories/comments-repository.ts'
import { InMemoryProjectsRepository } from 'test/repositories/projects-repository.ts'
import { InMemoryStudentsRepository } from 'test/repositories/students-repository.ts'
import { InMemorySubjectsRepository } from 'test/repositories/subjects-repository.ts'
import { InMemoryTrailsRepository } from 'test/repositories/trails-repository.ts'
import type { Comment } from '../../enterprise/entities/comment.ts'
import type { Project } from '../../enterprise/entities/project.ts'
import type { Student } from '../../enterprise/entities/student.ts'
import { DeleteCommentUseCase } from './delete-comment.ts'

let commentsRepository: InMemoryCommentsRepository
let studentsRepository: InMemoryStudentsRepository
let subjectsRepository: InMemorySubjectsRepository
let trailsRepository: InMemoryTrailsRepository
let projectsRepository: InMemoryProjectsRepository

let author: Student
let project: Project
let comment: Comment

let sut: DeleteCommentUseCase

describe('delete comment use case', () => {
  beforeEach(async () => {
    studentsRepository = new InMemoryStudentsRepository()
    commentsRepository = new InMemoryCommentsRepository(studentsRepository)
    subjectsRepository = new InMemorySubjectsRepository()
    trailsRepository = new InMemoryTrailsRepository()
    projectsRepository = new InMemoryProjectsRepository(
      studentsRepository,
      subjectsRepository,
      commentsRepository,
    )

    author = await makeStudent()
    const trail = makeTrail()
    project = makeProject({
      authorId: author.id,
      trails: [trail],
    })
    comment = makeComment({
      authorId: author.id,
      projectId: project.id,
    })

    await studentsRepository.create(author)
    await trailsRepository.create(trail)
    await projectsRepository.create(project)
    await commentsRepository.create(comment)

    sut = new DeleteCommentUseCase(
      commentsRepository,
      studentsRepository,
      projectsRepository,
    )
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
    await projectsRepository.delete(project.id.toString())

    const response = await sut.execute({
      projectId: 'invalid-project-id',
      authorId: author.id.toString(),
      commentId: comment.id.toString(),
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
