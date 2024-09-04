import type { SubjectsRepository } from '@/domain/deck/application/repositories/subjects-repository.ts'
import type { Subject } from '@/domain/deck/enterprise/entities/subject.ts'
import type { PrismaClient } from '@prisma/client'
import { PrismaSubjectMapper } from '../mappers/prisma-subject-mapper.ts'

export class PrismaSubjectsRepository implements SubjectsRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Subject | null> {
    const subject = await this.prisma.subject.findUnique({ where: { id } })

    if (!subject) return null

    return PrismaSubjectMapper.toEntity(subject)
  }

  async findByName(name: string): Promise<Subject | null> {
    const subject = await this.prisma.subject.findFirst({ where: { name } })

    if (!subject) return null

    return PrismaSubjectMapper.toEntity(subject)
  }

  async fetchAll(): Promise<Subject[]> {
    const subjects = await this.prisma.subject.findMany()
    return subjects.map(PrismaSubjectMapper.toEntity)
  }

  async fetchByName(name: string): Promise<Subject[]> {
    const subjects = await this.prisma.subject.findMany({
      where: { name: { contains: name } },
    })

    return subjects.map(PrismaSubjectMapper.toEntity)
  }

  async create(subject: Subject): Promise<void> {
    const data = PrismaSubjectMapper.toPrisma(subject)
    await this.prisma.subject.create({ data })
  }

  async save(subject: Subject): Promise<void> {
    const data = PrismaSubjectMapper.toPrisma(subject)

    await this.prisma.subject.update({
      where: { id: subject.id.toString() },
      data,
    })
  }

  async delete(subject: Subject): Promise<void> {
    await this.prisma.subject.delete({
      where: { id: subject.id.toString() },
    })
  }
}
