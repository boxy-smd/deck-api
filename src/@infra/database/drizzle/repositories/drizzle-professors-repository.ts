import { ProfessorsRepository } from '@/@core/application/professors/repositories/professors-repository'
import { Professor } from '@/@core/domain/projects/entities/professor'
import { Inject, Injectable } from '@nestjs/common'
import { eq, ilike } from 'drizzle-orm'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { DRIZZLE } from '../drizzle.provider'
import { DrizzleProfessorMapper } from '../mappers/drizzle-professor-mapper'
import * as schema from '../schema'
import { professors } from '../schema'

@Injectable()
export class DrizzleProfessorsRepository implements ProfessorsRepository {
  constructor(
    @Inject(DRIZZLE) private drizzle: NodePgDatabase<typeof schema>,
  ) {}

  async findById(id: string): Promise<Professor | null> {
    const results = await this.drizzle
      .select()
      .from(professors)
      .where(eq(professors.id, id))
      .limit(1)

    if (results.length === 0) return null

    return DrizzleProfessorMapper.toEntity(results[0])
  }

  async findAll(): Promise<Professor[]> {
    const results = await this.drizzle.select().from(professors)

    return results.map(DrizzleProfessorMapper.toEntity)
  }

  async create(entity: Professor): Promise<void> {
    await this.drizzle.insert(professors).values({
      id: entity.id.toString(),
      name: entity.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  async save(entity: Professor): Promise<void> {
    await this.drizzle
      .update(professors)
      .set({
        name: entity.name,
        updatedAt: new Date(),
      })
      .where(eq(professors.id, entity.id.toString()))
  }

  async delete(entity: Professor): Promise<void> {
    await this.deleteById(entity.id.toString())
  }

  async deleteById(id: string): Promise<void> {
    await this.drizzle.delete(professors).where(eq(professors.id, id))
  }

  async existsById(id: string): Promise<boolean> {
    const results = await this.drizzle
      .select({ id: professors.id })
      .from(professors)
      .where(eq(professors.id, id))
      .limit(1)
    return results.length > 0
  }

  async findManyByName(name: string): Promise<Professor[]> {
    const results = await this.drizzle
      .select()
      .from(professors)
      .where(ilike(professors.name, `%${name}%`))

    return results.map(DrizzleProfessorMapper.toEntity)
  }
}
