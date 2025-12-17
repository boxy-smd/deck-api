import { SubjectsRepository } from '@/@core/application/subjects/repositories/subjects-repository'
import { Subject } from '@/@core/domain/projects/entities/subject'
import { Injectable } from '@nestjs/common'
import { PrismaSubjectMapper } from '../mappers/prisma-subject-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaSubjectsRepository implements SubjectsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Subject | null> {
    const subject = await this.prisma.subject.findUnique({
      where: { id: id.toString() },
    })

    if (!subject) return null

    return PrismaSubjectMapper.toEntity(subject)
  }

  async findByName(name: string): Promise<Subject | null> {
    const subject = await this.prisma.subject.findFirst({ where: { name } })

    if (!subject) return null

    return PrismaSubjectMapper.toEntity(subject)
  }

  async findManyByName(name: string): Promise<Subject[]> {
    const subjects = await this.prisma.subject.findMany({
      where: { name: { contains: name } },
      orderBy: {
        name: 'asc',
      },
    })

    return subjects.map(PrismaSubjectMapper.toEntity)
  }

  async findAll(): Promise<Subject[]> {
    const subjects = await this.prisma.subject.findMany({
      orderBy: {
        name: 'asc',
      },
    })
    return subjects.map(PrismaSubjectMapper.toEntity)
  }

  async existsById(id: string): Promise<boolean> {
    const count = await this.prisma.subject.count({
      where: { id: id.toString() },
    })
    return count > 0
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

  async deleteById(id: string): Promise<void> {
    await this.prisma.subject.delete({
      where: { id: id.toString() },
    })
  }
}
