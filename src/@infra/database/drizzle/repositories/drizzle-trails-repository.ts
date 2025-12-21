import { Inject, Injectable } from '@nestjs/common'
import { eq, ilike } from 'drizzle-orm'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { TrailsRepository } from '@/@core/application/trails/repositories/trails-repository'
import { Trail } from '@/@core/domain/projects/entities/trail'
import { DRIZZLE } from '../drizzle.provider'
import { DrizzleTrailMapper } from '../mappers/drizzle-trail-mapper'
import * as schema from '../schema'
import { trails } from '../schema'

@Injectable()
export class DrizzleTrailsRepository implements TrailsRepository {
  constructor(
    @Inject(DRIZZLE) private drizzle: NodePgDatabase<typeof schema>,
  ) {}

  async findById(id: string): Promise<Trail | null> {
    const results = await this.drizzle
      .select()
      .from(trails)
      .where(eq(trails.id, id))
      .limit(1)

    if (results.length === 0) return null

    return DrizzleTrailMapper.toEntity(results[0])
  }

  async findAll(): Promise<Trail[]> {
    const results = await this.drizzle.select().from(trails)

    return results.map(DrizzleTrailMapper.toEntity)
  }

  async create(entity: Trail): Promise<void> {
    await this.drizzle.insert(trails).values({
      id: entity.id.toString(),
      name: entity.name,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    })
  }

  async save(entity: Trail): Promise<void> {
    await this.drizzle
      .update(trails)
      .set({
        name: entity.name,
        updatedAt: new Date(),
      })
      .where(eq(trails.id, entity.id.toString()))
  }

  async delete(entity: Trail): Promise<void> {
    await this.deleteById(entity.id.toString())
  }

  async deleteById(id: string): Promise<void> {
    await this.drizzle.delete(trails).where(eq(trails.id, id))
  }

  async existsById(id: string): Promise<boolean> {
    const results = await this.drizzle
      .select({ id: trails.id })
      .from(trails)
      .where(eq(trails.id, id))
      .limit(1)
    return results.length > 0
  }

  async findByName(name: string): Promise<Trail | null> {
    const results = await this.drizzle
      .select()
      .from(trails)
      .where(eq(trails.name, name))
      .limit(1)

    if (results.length === 0) return null

    return DrizzleTrailMapper.toEntity(results[0])
  }

  async findManyByName(name: string): Promise<Trail[]> {
    const results = await this.drizzle
      .select()
      .from(trails)
      .where(ilike(trails.name, `%${name}%`))

    return results.map(DrizzleTrailMapper.toEntity)
  }
}
