import { drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { ProjectStatus } from '@/@core/domain/projects/value-objects/project-status'
import { makeProfessor } from '../../../../../test/factories/make-professor'
import { makeProject } from '../../../../../test/factories/make-project'
import { makeTrail } from '../../../../../test/factories/make-trail'
import { makeUser } from '../../../../../test/factories/make-user'
import * as schema from '../schema'
import { DrizzleProjectsRepository } from './drizzle-projects-repository'
import { DrizzleUsersRepository } from './drizzle-users-repository'

const { Pool } = pg

describe('DrizzleProjectsRepository (Integration)', () => {
  let pool: pg.Pool
  // Relax typing here to avoid strict NodePgDatabase<typeof schema> mismatch in tests.
  // Using `any` in integration tests allows passing the runtime db object returned by
  // `drizzle(pool, { schema })` into repositories that expect a typed schema.
  // biome-ignore lint/suspicious/noExplicitAny: integration tests
  let db: any
  let repository: DrizzleProjectsRepository
  let usersRepository: DrizzleUsersRepository

  beforeAll(() => {
    const DATABASE_URL = process.env.DATABASE_URL
    if (!DATABASE_URL) {
      throw new Error('DATABASE_URL must be set for integration tests')
    }

    pool = new Pool({ connectionString: DATABASE_URL })
    db = drizzle(pool, { schema })
    repository = new DrizzleProjectsRepository(db)
    usersRepository = new DrizzleUsersRepository(db)
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('create()', () => {
    it('should create project without relationships', async () => {
      const author = await makeUser({ profile: undefined })
      await usersRepository.create(author)

      const project = makeProject({
        title: 'Test Project',
        authorId: author.id,
        trails: new Set(),
        professors: new Set(),
      })

      await repository.create(project)

      const found = await repository.findById(project.id.toString())
      expect(found).toBeDefined()
      expect(found?.title).toBe('Test Project')
      expect(found?.authorId.toString()).toBe(author.id.toString())
    })

    it('should create project with trails', async () => {
      const author = await makeUser({ profile: undefined })
      await usersRepository.create(author)

      // Criar trails no banco primeiro
      const trail1 = makeTrail({ name: 'Design Digital' })
      const trail2 = makeTrail({ name: 'Desenvolvimento' })

      await db.insert(schema.trails).values([
        {
          id: trail1.id.toString(),
          name: trail1.name,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: trail2.id.toString(),
          name: trail2.name,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ])

      const project = makeProject({
        authorId: author.id,
        trails: new Set([trail1.id, trail2.id]),
        professors: new Set(),
      })

      await repository.create(project)

      const found = await repository.findById(project.id.toString())
      expect(found).toBeDefined()
      expect(found?.trails.size).toBe(2)
    })

    it('should create project with professors', async () => {
      const author = await makeUser({ profile: undefined })
      await usersRepository.create(author)

      // Criar professors no banco primeiro
      const prof1 = makeProfessor({ name: 'Prof. Carlos' })
      const prof2 = makeProfessor({ name: 'Prof. Ana' })

      await db.insert(schema.professors).values([
        {
          id: prof1.id.toString(),
          name: prof1.name,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: prof2.id.toString(),
          name: prof2.name,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ])

      const project = makeProject({
        authorId: author.id,
        trails: new Set(),
        professors: new Set([prof1.id, prof2.id]),
      })

      await repository.create(project)

      const found = await repository.findById(project.id.toString())
      expect(found).toBeDefined()
      expect(found?.professors.size).toBe(2)
    })

    it('should create project with all relationships', async () => {
      const author = await makeUser({ profile: undefined })
      await usersRepository.create(author)

      const trail = makeTrail({ name: 'Audiovisual' })
      const professor = makeProfessor({ name: 'Prof. João' })

      await db.insert(schema.trails).values({
        id: trail.id.toString(),
        name: trail.name,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      await db.insert(schema.professors).values({
        id: professor.id.toString(),
        name: professor.name,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const project = makeProject({
        authorId: author.id,
        trails: new Set([trail.id]),
        professors: new Set([professor.id]),
      })

      await repository.create(project)

      const found = await repository.findById(project.id.toString())
      expect(found).toBeDefined()
      expect(found?.trails.size).toBe(1)
      expect(found?.professors.size).toBe(1)
    })
  })

  describe('findById()', () => {
    it('should return null for non-existent project', async () => {
      const { randomUUID } = await import('node:crypto')
      const found = await repository.findById(randomUUID())
      expect(found).toBeNull()
    })

    it('should find project by id', async () => {
      const author = await makeUser({ profile: undefined })
      await usersRepository.create(author)

      const project = makeProject({
        authorId: author.id,
        trails: new Set(),
        professors: new Set(),
      })
      await repository.create(project)

      const found = await repository.findById(project.id.toString())
      expect(found).toBeDefined()
      expect(found?.id.toString()).toBe(project.id.toString())
    })
  })

  describe('findAll()', () => {
    it('should return empty array when no projects', async () => {
      const projects = await repository.findAll()
      expect(projects).toEqual([])
    })

    it('should return all projects ordered by creation date', async () => {
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
      const project3 = makeProject({
        title: 'Project 3',
        authorId: author.id,
        trails: new Set(),
        professors: new Set(),
      })

      await repository.create(project1)
      await repository.create(project2)
      await repository.create(project3)

      const projects = await repository.findAll()
      expect(projects).toHaveLength(3)
    })
  })

  // findByAuthorId() não existe no repository - removido

  describe('save()', () => {
    it('should update project basic fields', async () => {
      const author = await makeUser({ profile: undefined })
      await usersRepository.create(author)

      const project = makeProject({
        title: 'Original Title',
        authorId: author.id,
        trails: new Set(),
        professors: new Set(),
      })
      await repository.create(project)

      const updatedProject = makeProject(
        {
          title: 'Updated Title',
          description: 'New description',
          status: ProjectStatus.PUBLISHED,
          authorId: author.id,
          trails: new Set(),
          professors: new Set(),
        },
        project.id,
      )

      await repository.save(updatedProject)

      const found = await repository.findById(project.id.toString())
      expect(found?.title).toBe('Updated Title')
      expect(found?.description).toBe('New description')
      expect(found?.status).toBe(ProjectStatus.PUBLISHED)
    })

    it('should update project trails', async () => {
      const author = await makeUser({ profile: undefined })
      await usersRepository.create(author)

      const trail1 = makeTrail({ name: 'Trail 1' })
      const trail2 = makeTrail({ name: 'Trail 2' })
      const trail3 = makeTrail({ name: 'Trail 3' })

      await db.insert(schema.trails).values([
        {
          id: trail1.id.toString(),
          name: trail1.name,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: trail2.id.toString(),
          name: trail2.name,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: trail3.id.toString(),
          name: trail3.name,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ])

      const project = makeProject({
        authorId: author.id,
        trails: new Set([trail1.id]),
        professors: new Set(),
      })
      await repository.create(project)

      const updatedProject = makeProject(
        {
          authorId: author.id,
          trails: new Set([trail2.id, trail3.id]),
          professors: new Set(),
        },
        project.id,
      )

      await repository.save(updatedProject)

      const found = await repository.findById(project.id.toString())
      expect(found?.trails.size).toBe(2)
    })
  })

  describe('delete()', () => {
    it('should delete project', async () => {
      const author = await makeUser({ profile: undefined })
      await usersRepository.create(author)

      const project = makeProject({
        authorId: author.id,
        trails: new Set(),
        professors: new Set(),
      })
      await repository.create(project)

      await repository.deleteById(project.id.toString())

      const found = await repository.findById(project.id.toString())
      expect(found).toBeNull()
    })

    it('should cascade delete project trails and professors', async () => {
      const author = await makeUser({ profile: undefined })
      await usersRepository.create(author)

      const trail = makeTrail()
      const professor = makeProfessor()

      await db.insert(schema.trails).values({
        id: trail.id.toString(),
        name: trail.name,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      await db.insert(schema.professors).values({
        id: professor.id.toString(),
        name: professor.name,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const project = makeProject({
        authorId: author.id,
        trails: new Set([trail.id]),
        professors: new Set([professor.id]),
      })
      await repository.create(project)

      await repository.deleteById(project.id.toString())

      const found = await repository.findById(project.id.toString())
      expect(found).toBeNull()

      // Verificar que trails e professors ainda existem (apenas a relação foi deletada)
      const trailStillExists = await db.query.trails.findFirst({
        where: (trails, { eq }) => eq(trails.id, trail.id.toString()),
      })
      expect(trailStillExists).toBeDefined()
    })
  })

  // search() não existe no repository - removido
})
