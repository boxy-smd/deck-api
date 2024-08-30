import type {
  ProfessorsRepository,
  UpdateProfessorRequest,
} from '@/application/repositories/professors-repository.ts'
import type { Professor } from '@/domain/entities/professor.entity.ts'
import { prisma } from '../client.ts'
import { ProfessorMapper } from '../mappers/professor-mapper.ts'

export class PrismaProfessorsRepository implements ProfessorsRepository {
  async create(professor: Professor): Promise<Professor> {
    const raw = ProfessorMapper.toPersistence(professor)
    const createdRaw = await prisma.professor.create({ data: raw })
    return ProfessorMapper.toDomain(createdRaw)
  }

  async findById(id: string): Promise<Professor | null> {
    const raw = await prisma.professor.findUnique({ where: { id } })
    return raw ? ProfessorMapper.toDomain(raw) : null
  }

  async fetchByName(name: string): Promise<Professor[]> {
    const professors = await prisma.professor.findMany({ where: { name } })
    return professors.map(professor => ProfessorMapper.toDomain(professor))
  }

  async fetch(): Promise<Professor[]> {
    const professors = await prisma.professor.findMany()
    return professors.map(professor => ProfessorMapper.toDomain(professor))
  }

  async update(
    id: string,
    request: UpdateProfessorRequest,
  ): Promise<Professor | null> {
    const raw = ProfessorMapper.toPersistenceUpdate(request)
    const updatedProfessor = await prisma.professor.update({
      where: { id },
      data: raw,
    })
    return ProfessorMapper.toDomain(updatedProfessor)
  }

  async delete(id: string): Promise<void> {
    await prisma.professor.delete({ where: { id } })
  }
}
