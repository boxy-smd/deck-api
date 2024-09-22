import type { ProfessorsRepository } from '@/domain/deck/application/repositories/professors-repository.ts'
import type { Professor } from '@/domain/deck/enterprise/entities/professor.ts'
import { prisma } from '../client.ts'
import { PrismaProfessorMapper } from '../mappers/prisma-professor-mapper.ts'

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
}
