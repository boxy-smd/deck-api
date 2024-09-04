import type { ProfessorsRepository } from '@/domain/deck/application/repositories/professors-repository.ts'
import type { Professor } from '@/domain/deck/enterprise/entities/professor.ts'
import type { PrismaClient } from '@prisma/client'
import { PrismaProfessorMapper } from '../mappers/prisma-professor-mapper.ts'

export class PrismaProfessorsRepository implements ProfessorsRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Professor | null> {
    const professor = await this.prisma.professor.findUnique({ where: { id } })

    if (!professor) return null

    return PrismaProfessorMapper.toEntity(professor)
  }

  async findByName(name: string): Promise<Professor | null> {
    const professor = await this.prisma.professor.findFirst({ where: { name } })

    if (!professor) return null

    return PrismaProfessorMapper.toEntity(professor)
  }

  async fetchAll(): Promise<Professor[]> {
    const professors = await this.prisma.professor.findMany()
    return professors.map(PrismaProfessorMapper.toEntity)
  }

  async fetchByName(name: string): Promise<Professor[]> {
    const professors = await this.prisma.professor.findMany({
      where: { name: { contains: name } },
    })

    return professors.map(PrismaProfessorMapper.toEntity)
  }

  async create(professor: Professor): Promise<void> {
    const data = PrismaProfessorMapper.toPrisma(professor)
    await this.prisma.professor.create({ data })
  }

  async save(professor: Professor): Promise<void> {
    const data = PrismaProfessorMapper.toPrisma(professor)

    await this.prisma.professor.update({
      where: { id: professor.id.toString() },
      data,
    })
  }

  async delete(professor: Professor): Promise<void> {
    await this.prisma.professor.delete({
      where: { id: professor.id.toString() },
    })
  }
}
