import type { ProjectProfessorsRepository } from '@/domain/deck/application/repositories/project-professors-repository.ts'
import type { ProjectProfessor } from '@/domain/deck/enterprise/entities/project-professor.ts'
import type { PrismaClient } from '@prisma/client'
import { PrismaProjectProfessorMapper } from '../mappers/prisma-project-professor-mapper.ts'

export class PrismaProjectProfessorsRepository implements ProjectProfessorsRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<ProjectProfessor | null> {
    const projectProfessor = await this.prisma.projectProfessor.findUnique({ where: { id } })

    if (!projectProfessor) return null

    return PrismaProjectProfessorMapper.toEntity(projectProfessor)
  }

  async findByName(name: string): Promise<ProjectProfessor | null> {
    const projectProfessor = await this.prisma.projectProfessor.findFirst({ where: { name } })

    if (!projectProfessor) return null

    return PrismaProjectProfessorMapper.toEntity(projectProfessor)
  }

  async fetchAll(): Promise<ProjectProfessor[]> {
    const projectProfessors = await this.prisma.projectProfessor.findMany()
    return projectProfessors.map(PrismaProjectProfessorMapper.toEntity)
  }

  async fetchByName(name: string): Promise<ProjectProfessor[]> {
    const projectProfessors = await this.prisma.projectProfessor.findMany({
      where: { name: { contains: name } },
    })

    return projectProfessors.map(PrismaProjectProfessorMapper.toEntity)
  }

  async create(projectProfessor: ProjectProfessor): Promise<void> {
    const data = PrismaProjectProfessorMapper.toPrisma(projectProfessor)
    await this.prisma.projectProfessor.create({ data })
  }

  async save(projectProfessor: ProjectProfessor): Promise<void> {
    const data = PrismaProjectProfessorMapper.toPrisma(projectProfessor)

    await this.prisma.projectProfessor.update({
      where: { id: projectProfessor.id.toString() },
      data,
    })
  }

  async delete(projectProfessor: ProjectProfessor): Promise<void> {
    await this.prisma.projectProfessor.delete({
      where: { id: projectProfessor.id.toString() },
    })
  }
}
