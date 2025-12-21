import { Professor } from '@/@core/domain/projects/entities/professor'
import { UniqueEntityID } from '@/@shared/kernel/kernel/unique-entity-id'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import * as schema from '../schema'
import { DrizzleProfessorsRepository } from './drizzle-professors-repository'

describe('DrizzleProfessorsRepository (Integration)', () => {
  let pool: Pool
  let db: ReturnType<typeof drizzle<typeof schema>>
  let repository: DrizzleProfessorsRepository

  beforeAll(() => {
    const databaseUrl = process.env.DATABASE_URL
    if (!databaseUrl) {
      throw new Error('DATABASE_URL must be set for integration tests')
    }

    pool = new Pool({ connectionString: databaseUrl })
    db = drizzle(pool, { schema })
    repository = new DrizzleProfessorsRepository(db)
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('create() and findById()', () => {
    it('should create and retrieve a professor', async () => {
      const professor = Professor.create({
        name: 'Prof. Carlos Silva',
      })

      await repository.create(professor)
      const found = await repository.findById(professor.id.toString())

      expect(found).toBeDefined()
      expect(found?.id.toString()).toBe(professor.id.toString())
      expect(found?.name).toBe('Prof. Carlos Silva')
    })

    it('should return null for non-existent professor', async () => {
      const nonExistentId = new UniqueEntityID().toString()
      const found = await repository.findById(nonExistentId)

      expect(found).toBeNull()
    })
  })

  describe('findAll()', () => {
    it('should return all professors', async () => {
      const prof1 = Professor.create({ name: 'Prof. Ana' })
      const prof2 = Professor.create({ name: 'Prof. Bruno' })

      await repository.create(prof1)
      await repository.create(prof2)

      const all = await repository.findAll()

      expect(all.length).toBeGreaterThanOrEqual(2)
      expect(all.some(p => p.name === 'Prof. Ana')).toBe(true)
      expect(all.some(p => p.name === 'Prof. Bruno')).toBe(true)
    })
  })

  describe('save()', () => {
    it('should update professor name', async () => {
      const professor = Professor.create({
        name: 'Prof. Original Name',
      })
      await repository.create(professor)

      // Simulate entity update
      const updated = Professor.reconstitute(
        { name: 'Prof. Updated Name' },
        professor.id,
        professor.createdAt,
        new Date(),
      )

      await repository.save(updated)
      const found = await repository.findById(professor.id.toString())

      expect(found?.name).toBe('Prof. Updated Name')
    })
  })

  describe('delete() and deleteById()', () => {
    it('should delete professor by entity', async () => {
      const professor = Professor.create({ name: 'Prof. To Delete' })
      await repository.create(professor)

      await repository.delete(professor)
      const found = await repository.findById(professor.id.toString())

      expect(found).toBeNull()
    })

    it('should delete professor by id', async () => {
      const professor = Professor.create({ name: 'Prof. To Delete By ID' })
      await repository.create(professor)

      await repository.deleteById(professor.id.toString())
      const found = await repository.findById(professor.id.toString())

      expect(found).toBeNull()
    })
  })

  describe('findManyByName()', () => {
    it('should find professors by name (partial match)', async () => {
      const prof1 = Professor.create({ name: 'José da Silva' })
      const prof2 = Professor.create({ name: 'José Santos' })
      const prof3 = Professor.create({ name: 'Maria Oliveira' })

      await repository.create(prof1)
      await repository.create(prof2)
      await repository.create(prof3)

      const results = await repository.findManyByName('José')

      expect(results.length).toBeGreaterThanOrEqual(2)
      expect(results.some(p => p.name.includes('José'))).toBe(true)
      expect(results.every(p => p.name.toLowerCase().includes('josé'))).toBe(
        true,
      )
    })

    it('should return empty array when no match', async () => {
      const results = await repository.findManyByName('NonExistentProfessor123')

      expect(results).toEqual([])
    })

    it('should be case insensitive', async () => {
      const professor = Professor.create({ name: 'UPPERCASE NAME' })
      await repository.create(professor)

      const results = await repository.findManyByName('uppercase')

      expect(results.length).toBeGreaterThanOrEqual(1)
      expect(results.some(p => p.name === 'UPPERCASE NAME')).toBe(true)
    })
  })
})
