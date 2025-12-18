import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'
import { DrizzleCommentsRepository } from './drizzle-comments-repository'
import { DrizzleUsersRepository } from './drizzle-users-repository'
import { DrizzleProjectsRepository } from './drizzle-projects-repository'
import * as schema from '../schema'
import { clearDatabase } from '../../../../../test/integration/helpers/database-helper'
import { makeComment } from '../../../../../test/factories/make-comment'
import { makeUser } from '../../../../../test/factories/make-user'
import { makeProject } from '../../../../../test/factories/make-project'

const { Pool } = pg

describe('DrizzleCommentsRepository (Integration)', () => {
  let pool: pg.Pool
  let db: ReturnType<typeof drizzle>
  let repository: DrizzleCommentsRepository
  let usersRepository: DrizzleUsersRepository
  let projectsRepository: DrizzleProjectsRepository

  beforeAll(async () => {
    const DATABASE_URL = process.env.DATABASE_URL
    if (!DATABASE_URL) {
      throw new Error('DATABASE_URL must be set for integration tests')
    }

    pool = new Pool({ connectionString: DATABASE_URL })
    db = drizzle(pool, { schema })
    repository = new DrizzleCommentsRepository(db)
    usersRepository = new DrizzleUsersRepository(db)
    projectsRepository = new DrizzleProjectsRepository(db)
  })

  afterEach(async () => {
    await clearDatabase(db)
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('create()', () => {
    it('should create comment', async () => {
      const author = await makeUser({ profile: undefined })
      await usersRepository.create(author)

      const project = makeProject({
        authorId: author.id,
        trails: new Set(),
        professors: new Set(),
      })
      await projectsRepository.create(project)

      const comment = makeComment({
        content: 'Great project!',
        authorId: author.id,
        projectId: project.id,
      })

      await repository.create(comment)

      const found = await repository.findById(comment.id.toString())
      expect(found).toBeDefined()
      expect(found?.content).toBe('Great project!')
      expect(found?.authorId.toString()).toBe(author.id.toString())
      expect(found?.projectId.toString()).toBe(project.id.toString())
    })
  })

  describe('findById()', () => {
    it('should return null for non-existent comment', async () => {
      const { randomUUID } = await import('crypto')
      const found = await repository.findById(randomUUID())
      expect(found).toBeNull()
    })

    it('should find comment by id', async () => {
      const author = await makeUser({ profile: undefined })
      await usersRepository.create(author)

      const project = makeProject({
        authorId: author.id,
        trails: new Set(),
        professors: new Set(),
      })
      await projectsRepository.create(project)

      const comment = makeComment({
        authorId: author.id,
        projectId: project.id,
      })
      await repository.create(comment)

      const found = await repository.findById(comment.id.toString())
      expect(found).toBeDefined()
      expect(found?.id.toString()).toBe(comment.id.toString())
    })
  })

  describe('findAll()', () => {
    it('should return empty array when no comments', async () => {
      const comments = await repository.findAll()
      expect(comments).toEqual([])
    })

    it('should return all comments ordered by creation date', async () => {
      const author = await makeUser({ profile: undefined })
      await usersRepository.create(author)

      const project = makeProject({
        authorId: author.id,
        trails: new Set(),
        professors: new Set(),
      })
      await projectsRepository.create(project)

      const comment1 = makeComment({ content: 'Comment 1', authorId: author.id, projectId: project.id })
      const comment2 = makeComment({ content: 'Comment 2', authorId: author.id, projectId: project.id })
      const comment3 = makeComment({ content: 'Comment 3', authorId: author.id, projectId: project.id })

      await repository.create(comment1)
      await repository.create(comment2)
      await repository.create(comment3)

      const comments = await repository.findAll()
      expect(comments).toHaveLength(3)
    })
  })

  describe('findByProjectId()', () => {
    it('should return comments for specific project', async () => {
      const author = await makeUser({ profile: undefined })
      await usersRepository.create(author)

      const project1 = makeProject({
        title: 'Project 1',
        authorId: author.id,
        trails: new Set(),
        professors: new Set(),
      })
      const project2 = makeProject({
        title: 'Project 2',
        authorId: author.id,
        trails: new Set(),
        professors: new Set(),
      })
      await projectsRepository.create(project1)
      await projectsRepository.create(project2)

      const comment1 = makeComment({ authorId: author.id, projectId: project1.id })
      const comment2 = makeComment({ authorId: author.id, projectId: project1.id })
      const comment3 = makeComment({ authorId: author.id, projectId: project2.id })

      await repository.create(comment1)
      await repository.create(comment2)
      await repository.create(comment3)

      const project1Comments = await repository.findByProjectId(project1.id.toString())
      expect(project1Comments).toHaveLength(2)
    })

    it('should return empty array for project without comments', async () => {
      const author = await makeUser({ profile: undefined })
      await usersRepository.create(author)

      const project = makeProject({
        authorId: author.id,
        trails: new Set(),
        professors: new Set(),
      })
      await projectsRepository.create(project)

      const comments = await repository.findByProjectId(project.id.toString())
      expect(comments).toEqual([])
    })
  })

  describe('findManyByProjectIdWithAuthors()', () => {
    it('should return comments with author information', async () => {
      const author = await makeUser({ 
        name: 'John Doe',
        profile: undefined 
      })
      await usersRepository.create(author)

      const project = makeProject({
        authorId: author.id,
        trails: new Set(),
        professors: new Set(),
      })
      await projectsRepository.create(project)

      const comment = makeComment({
        content: 'Nice work!',
        authorId: author.id,
        projectId: project.id,
      })
      await repository.create(comment)

      const commentsWithAuthors = await repository.findManyByProjectIdWithAuthors(
        project.id.toString()
      )

      expect(commentsWithAuthors).toHaveLength(1)
      expect(commentsWithAuthors[0].content).toBe('Nice work!')
      expect(commentsWithAuthors[0].authorName).toBe('John Doe')
    })
  })

  describe('save()', () => {
    it('should update comment content', async () => {
      const author = await makeUser({ profile: undefined })
      await usersRepository.create(author)

      const project = makeProject({
        authorId: author.id,
        trails: new Set(),
        professors: new Set(),
      })
      await projectsRepository.create(project)

      const comment = makeComment({
        content: 'Original content',
        authorId: author.id,
        projectId: project.id,
      })
      await repository.create(comment)

      const updatedComment = makeComment({
        content: 'Updated content',
        authorId: author.id,
        projectId: project.id,
      }, comment.id)

      await repository.save(updatedComment)

      const found = await repository.findById(comment.id.toString())
      expect(found?.content).toBe('Updated content')
    })
  })

  describe('delete()', () => {
    it('should delete comment', async () => {
      const author = await makeUser({ profile: undefined })
      await usersRepository.create(author)

      const project = makeProject({
        authorId: author.id,
        trails: new Set(),
        professors: new Set(),
      })
      await projectsRepository.create(project)

      const comment = makeComment({
        authorId: author.id,
        projectId: project.id,
      })
      await repository.create(comment)

      await repository.delete(comment)

      const found = await repository.findById(comment.id.toString())
      expect(found).toBeNull()
    })
  })

  describe('deleteManyByProjectId()', () => {
    it('should delete all comments from a project', async () => {
      const author = await makeUser({ profile: undefined })
      await usersRepository.create(author)

      const project = makeProject({
        authorId: author.id,
        trails: new Set(),
        professors: new Set(),
      })
      await projectsRepository.create(project)

      const comment1 = makeComment({ authorId: author.id, projectId: project.id })
      const comment2 = makeComment({ authorId: author.id, projectId: project.id })
      const comment3 = makeComment({ authorId: author.id, projectId: project.id })

      await repository.create(comment1)
      await repository.create(comment2)
      await repository.create(comment3)

      await repository.deleteManyByProjectId(project.id.toString())

      const comments = await repository.findByProjectId(project.id.toString())
      expect(comments).toEqual([])
    })

    it('should only delete comments from specified project', async () => {
      const author = await makeUser({ profile: undefined })
      await usersRepository.create(author)

      const project1 = makeProject({
        authorId: author.id,
        trails: new Set(),
        professors: new Set(),
      })
      const project2 = makeProject({
        authorId: author.id,
        trails: new Set(),
        professors: new Set(),
      })
      await projectsRepository.create(project1)
      await projectsRepository.create(project2)

      const comment1 = makeComment({ authorId: author.id, projectId: project1.id })
      const comment2 = makeComment({ authorId: author.id, projectId: project2.id })

      await repository.create(comment1)
      await repository.create(comment2)

      await repository.deleteManyByProjectId(project1.id.toString())

      const project1Comments = await repository.findByProjectId(project1.id.toString())
      const project2Comments = await repository.findByProjectId(project2.id.toString())

      expect(project1Comments).toEqual([])
      expect(project2Comments).toHaveLength(1)
    })
  })
})
