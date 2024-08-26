import type {
  SubjectsRepository,
  UpdateSubjectRequest,
} from '@/application/repositories/subjects-repository.ts'
import type { Subject } from '@/domain/entities/subject.entity.ts'
import { and, eq, ilike } from 'drizzle-orm'
import { db } from '../client.ts'
import { SubjectMapper } from '../mappers/subject-mapper.ts'
import { subjects } from '../schema.ts'

export class DrizzleSubjectsRepository implements SubjectsRepository {
  async create(subject: Subject): Promise<Subject> {
    const [createdSubject] = await db
      .insert(subjects)
      .values({
        ...SubjectMapper.toPersistence(subject),
      })
      .returning()

    return SubjectMapper.toDomain(createdSubject)
  }

  async findById(id: string): Promise<Subject | null> {
    const [subject] = await db
      .select()
      .from(subjects)
      .where(and(eq(subjects.id, id)))

    if (!subject) return null

    return SubjectMapper.toDomain(subject)
  }

  async findByName(name: string): Promise<Subject | null> {
    const [subject] = await db
      .select()
      .from(subjects)
      .where(and(ilike(subjects.name, name)))

    if (!subject) return null

    return SubjectMapper.toDomain(subject)
  }

  async fetchByQuery(query: { name: string }): Promise<Subject[]> {
    const subjectsList = await db
      .select()
      .from(subjects)
      .where(
        and(query.name ? ilike(subjects.name, `%${query.name}%`) : undefined),
      )

    return subjectsList.map(SubjectMapper.toDomain)
  }

  async update(
    id: string,
    request: UpdateSubjectRequest,
  ): Promise<Subject | null> {
    const [subject] = await db
      .select()
      .from(subjects)
      .where(and(eq(subjects.id, id)))

    if (!subject) return null

    const [updatedSubject] = await db
      .update(subjects)
      .set({
        ...request,
        updatedAt: new Date(),
      })
      .where(and(eq(subjects.id, id)))
      .returning()

    return SubjectMapper.toDomain(updatedSubject)
  }

  async delete(id: string): Promise<void> {
    await db
      .delete(subjects)
      .where(and(eq(subjects.id, id)))
      .execute()
  }
}
