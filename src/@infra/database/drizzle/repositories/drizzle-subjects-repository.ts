import { Inject, Injectable } from '@nestjs/common'
import { eq, ilike } from 'drizzle-orm'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { SubjectsRepository } from '@/@core/application/subjects/repositories/subjects-repository'
import { Subject } from '@/@core/domain/projects/entities/subject'
import { DRIZZLE } from '../drizzle.provider'
import { DrizzleSubjectMapper } from '../mappers/drizzle-subject-mapper'
import * as schema from '../schema'
import { subjects } from '../schema'

@Injectable()
export class DrizzleSubjectsRepository implements SubjectsRepository {
  constructor(
    @Inject(DRIZZLE) private drizzle: NodePgDatabase<typeof schema>,
  ) {}

  async findById(id: string): Promise<Subject | null> {
    const results = await this.drizzle
      .select()
      .from(subjects)
      .where(eq(subjects.id, id))
      .limit(1)

    if (results.length === 0) return null

    return DrizzleSubjectMapper.toEntity(results[0])
  }

  async findAll(): Promise<Subject[]> {
    const results = await this.drizzle.select().from(subjects)

    return results.map(DrizzleSubjectMapper.toEntity)
  }

  async create(entity: Subject): Promise<void> {
    await this.drizzle.insert(subjects).values({
      id: entity.id.toString(),
      name: entity.name,
      code: entity.code,
      semester: entity.semester,
      workload: entity.workload,
      type: entity.type,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  async save(entity: Subject): Promise<void> {
    await this.drizzle
      .update(subjects)
      .set({
        name: entity.name,
        code: entity.code,
        semester: entity.semester,
        workload: entity.workload,
        type: entity.type,
        updatedAt: new Date(),
      })
      .where(eq(subjects.id, entity.id.toString()))
  }

  async delete(entity: Subject): Promise<void> {
    await this.deleteById(entity.id.toString())
  }

  async deleteById(id: string): Promise<void> {
    await this.drizzle.delete(subjects).where(eq(subjects.id, id))
  }

  async existsById(id: string): Promise<boolean> {
    const results = await this.drizzle
      .select({ id: subjects.id })
      .from(subjects)
      .where(eq(subjects.id, id))
      .limit(1)
    return results.length > 0
  }

  async findByName(name: string): Promise<Subject | null> {
    const results = await this.drizzle
      .select()
      .from(subjects)
      .where(eq(subjects.name, name))
      .limit(1)

    if (results.length === 0) return null

    return DrizzleSubjectMapper.toEntity(results[0])
  }

  async findManyByName(name: string): Promise<Subject[]> {
    const results = await this.drizzle
      .select()
      .from(subjects)
      .where(ilike(subjects.name, `%${name}%`))

    return results.map(DrizzleSubjectMapper.toEntity)
  }
}
