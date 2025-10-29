import type { SubjectsRepository } from '@/@core/domain/projects/application/repositories/subjects-repository'
import type { Subject } from '@/@core/domain/projects/enterprise/entities/subject'
import { prisma } from '../client'
import { PrismaSubjectMapper } from '../mappers/prisma-subject-mapper'

export class PrismaSubjectsRepository implements SubjectsRepository {
  async findById(id: string): Promise<Subject | null> {
    const subject = await prisma.subject.findUnique({
      where: { id: id.toString() },
    })

    if (!subject) return null

    return PrismaSubjectMapper.toEntity(subject)
  }

  async findByName(name: string): Promise<Subject | null> {
    const subject = await prisma.subject.findFirst({ where: { name } })

    if (!subject) return null

    return PrismaSubjectMapper.toEntity(subject)
  }

  async findManyByName(name: string): Promise<Subject[]> {
    const subjects = await prisma.subject.findMany({
      where: { name: { contains: name } },
      orderBy: {
        name: 'asc',
      },
    })

    return subjects.map(PrismaSubjectMapper.toEntity)
  }

  async findAll(): Promise<Subject[]> {
    const subjects = await prisma.subject.findMany({
      orderBy: {
        name: 'asc',
      },
    })
    return subjects.map(PrismaSubjectMapper.toEntity)
  }

  async existsById(id: string): Promise<boolean> {
    const count = await prisma.subject.count({
      where: { id: id.toString() },
    })
    return count > 0
  }

  async create(subject: Subject): Promise<void> {
    const data = PrismaSubjectMapper.toPrisma(subject)
    await prisma.subject.create({ data })
  }

  async save(subject: Subject): Promise<void> {
    const data = PrismaSubjectMapper.toPrisma(subject)

    await prisma.subject.update({
      where: { id: subject.id.toString() },
      data,
    })
  }

  async delete(subject: Subject): Promise<void> {
    await prisma.subject.delete({
      where: { id: subject.id.toString() },
    })
  }

  async deleteById(id: string): Promise<void> {
    await prisma.subject.delete({
      where: { id: id.toString() },
    })
  }
}
