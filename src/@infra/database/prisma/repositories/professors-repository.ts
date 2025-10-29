import type { ProfessorsRepository } from '@/@core/domain/projects/application/repositories/professors-repository'
import type { Professor } from '@/@core/domain/projects/enterprise/entities/professor'
import { prisma } from '../client'
import { PrismaProfessorMapper } from '../mappers/prisma-professor-mapper'

export class PrismaProfessorsRepository implements ProfessorsRepository {
  async findById(id: string): Promise<Professor | null> {
    const professor = await prisma.professor.findUnique({ where: { id } })

    if (!professor) return null

    return PrismaProfessorMapper.toEntity(professor)
  }

  async findByName(name: string): Promise<Professor | null> {
    const professor = await prisma.professor.findFirst({ where: { name } })

    if (!professor) return null

    return PrismaProfessorMapper.toEntity(professor)
  }

  async findManyByName(name: string): Promise<Professor[]> {
    const professors = await prisma.professor.findMany({
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
    const professors = await prisma.professor.findMany({
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
    const count = await prisma.professor.count({
      where: {
        id,
      },
    })

    return count > 0
  }

  async create(professor: Professor): Promise<void> {
    const data = PrismaProfessorMapper.toPrisma(professor)
    await prisma.professor.create({ data })
  }

  async save(professor: Professor): Promise<void> {
    const data = PrismaProfessorMapper.toPrisma(professor)

    await prisma.professor.update({
      where: { id: professor.id.toString() },
      data,
    })
  }

  async delete(professor: Professor): Promise<void> {
    await prisma.professor.delete({
      where: { id: professor.id.toString() },
    })
  }

  async deleteById(id: string): Promise<void> {
    await prisma.professor.delete({
      where: { id },
    })
  }
}
