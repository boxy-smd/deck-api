import { ProfessorsRepository } from '@/@core/application/professors/repositories/professors-repository'
import { Professor } from '@/@core/domain/projects/entities/professor'
import { Injectable } from '@nestjs/common'
import { PrismaProfessorMapper } from '../mappers/prisma-professor-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaProfessorsRepository implements ProfessorsRepository {
  constructor(private readonly prisma: PrismaService) {}

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

  async findManyByName(name: string): Promise<Professor[]> {
    const professors = await this.prisma.professor.findMany({
      where: { name: { contains: name } },
      orderBy: {
        name: 'asc',
      },
    })

    const orderedProfessors = professors.sort((a, b) => {
      const professorA = a.name.replace('Prof. ', '').replace('Profa. ', '')
      const professorB = b.name.replace('Prof. ', '').replace('Profa. ', '')

      if (professorA < professorB) return -1
      if (professorA > professorB) return 1

      return 0
    })

    return orderedProfessors.map(PrismaProfessorMapper.toEntity)
  }

  async findAll(): Promise<Professor[]> {
    const professors = await this.prisma.professor.findMany({
      orderBy: {
        name: 'asc',
      },
    })

    const orderedProfessors = professors.sort((a, b) => {
      const professorA = a.name.replace('Prof. ', '').replace('Profa. ', '')
      const professorB = b.name.replace('Prof. ', '').replace('Profa. ', '')

      if (professorA < professorB) return -1
      if (professorA > professorB) return 1

      return 0
    })

    return orderedProfessors.map(PrismaProfessorMapper.toEntity)
  }

  async existsById(id: string): Promise<boolean> {
    const count = await this.prisma.professor.count({
      where: {
        id,
      },
    })

    return count > 0
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

  async deleteById(id: string): Promise<void> {
    await this.prisma.professor.delete({
      where: { id },
    })
  }
}
