import type {
  SubjectsRepository,
  UpdateSubjectRequest,
} from '@/application/repositories/subjects-repository.ts'
import type { Subject } from '@/domain/entities/subject.entity.ts'
import { prisma } from '../client.ts'
import { SubjectMapper } from '../mappers/subject-mapper.ts'

export class PrismaSubjectsRepository implements SubjectsRepository {
  async create(subject: Subject): Promise<Subject> {
    const raw = SubjectMapper.toPersistence(subject)
    const createdRaw = await prisma.subject.create({ data: raw })
    return SubjectMapper.toDomain(createdRaw)
  }

  async findById(id: string): Promise<Subject | null> {
    const raw = await prisma.subject.findUnique({ where: { id } })
    return raw ? SubjectMapper.toDomain(raw) : null
  }

  async findByName(name: string): Promise<Subject | null> {
    const raw = await prisma.subject.findFirst({ where: { name } })
    return raw ? SubjectMapper.toDomain(raw) : null
  }

  async fetchByName(name: string): Promise<Subject[]> {
    const subjects = await prisma.subject.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
    })
    return subjects.map(subject => SubjectMapper.toDomain(subject))
  }

  async fetch(): Promise<Subject[]> {
    const subjects = await prisma.subject.findMany()
    return subjects.map(subject => SubjectMapper.toDomain(subject))
  }

  async update(
    id: string,
    request: UpdateSubjectRequest,
  ): Promise<Subject | null> {
    const raw = SubjectMapper.toPersistenceUpdate(request)
    const updatedSubject = await prisma.subject.update({
      where: { id },
      data: raw,
    })
    return SubjectMapper.toDomain(updatedSubject)
  }

  async delete(id: string): Promise<void> {
    await prisma.subject.delete({ where: { id } })
  }
}
