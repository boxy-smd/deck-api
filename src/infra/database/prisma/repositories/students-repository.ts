import type { StudentsRepository } from '@/domain/deck/application/repositories/students-repository.ts'
import type { Student } from '@/domain/deck/enterprise/entities/student.ts'
import type { StudentProfile } from '@/domain/deck/enterprise/entities/value-objects/student-profile.ts'
import { prisma } from '../client.ts'
import { PrismaStudentMapper } from '../mappers/prisma-student-mapper.ts'
import type { PrismaProjectsRepository } from './projects-repository.ts'

export class PrismaStudentsRepository implements StudentsRepository {
  constructor(private readonly projectsRepository: PrismaProjectsRepository) {}

  async findById(id: string): Promise<Student | null> {
    const student = await prisma.user.findUnique({
      where: { id },
      include: { trails: true },
    })

    if (!student) return null

    return PrismaStudentMapper.toEntity(student)
  }

  async findByName(name: string): Promise<Student | null> {
    const student = await prisma.user.findFirst({
      where: { name },
      include: { trails: true },
    })

    if (!student) return null

    return PrismaStudentMapper.toEntity(student)
  }

  async findByEmail(email: string): Promise<Student | null> {
    const student = await prisma.user.findFirst({
      where: { email },
      include: { trails: true },
    })

    if (!student) return null

    return PrismaStudentMapper.toEntity(student)
  }

  async findByUsername(username: string): Promise<Student | null> {
    const student = await prisma.user.findFirst({
      where: { username },
      include: { trails: true },
    })

    if (!student) return null

    return PrismaStudentMapper.toEntity(student)
  }

  async findProfileByUsername(
    username: string,
  ): Promise<StudentProfile | null> {
    const raw = await prisma.user.findFirst({
      where: { username },
      include: {
        trails: {
          select: { name: true },
        },
      },
    })

    if (!raw) return null

    const student = {
      ...raw,
      posts: await this.projectsRepository.findManyPostsByQuery({
        authorId: raw.id,
      }),
    }

    return PrismaStudentMapper.toEntityProfile(student)
  }

  async findManyByName(name: string): Promise<Student[]> {
    const students = await prisma.user.findMany({
      where: {
        name: { contains: name, mode: 'insensitive' },
        username: name.startsWith('@')
          ? { contains: name.slice(1), mode: 'insensitive' }
          : undefined,
      },
      include: { trails: true },
    })

    return students.map(PrismaStudentMapper.toEntity)
  }

  async findAll(): Promise<Student[]> {
    const students = await prisma.user.findMany({
      include: { trails: true },
    })

    return students.map(PrismaStudentMapper.toEntity)
  }

  async create(student: Student): Promise<void> {
    const data = PrismaStudentMapper.toPrisma(student)
    await prisma.user.create({ data })
  }

  async save(student: Student): Promise<void> {
    const data = PrismaStudentMapper.toPrisma(student)

    await prisma.user.update({
      where: { id: student.id.toString() },
      data,
    })
  }

  async delete(student: Student): Promise<void> {
    await prisma.user.delete({
      where: { id: student.id.toString() },
    })
  }
}
