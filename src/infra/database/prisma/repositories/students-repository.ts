import type {
  StudentQuery,
  StudentsRepository,
} from '@/domain/deck/application/repositories/students-repository.ts'
import type { Student } from '@/domain/deck/enterprise/entities/student.ts'
import type { PrismaClient } from '@prisma/client'
import { PrismaStudentMapper } from '../mappers/prisma-student-mapper.ts'

export class PrismaStudentsRepository implements StudentsRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Student | null> {
    const student = await this.prisma.user.findUnique({ where: { id } })

    if (!student) return null

    return PrismaStudentMapper.toEntity(student)
  }

  async findByName(name: string): Promise<Student | null> {
    const student = await this.prisma.user.findFirst({ where: { name } })

    if (!student) return null

    return PrismaStudentMapper.toEntity(student)
  }

  async findByEmail(email: string): Promise<Student | null> {
    const student = await this.prisma.user.findFirst({ where: { email } })

    if (!student) return null

    return PrismaStudentMapper.toEntity(student)
  }

  async findByUsername(username: string): Promise<Student | null> {
    const student = await this.prisma.user.findFirst({ where: { username } })

    if (!student) return null

    return PrismaStudentMapper.toEntity(student)
  }

  async fetchAll(): Promise<Student[]> {
    const students = await this.prisma.user.findMany()
    return students.map(PrismaStudentMapper.toEntity)
  }

  async fetchByQuery({ name, username }: StudentQuery): Promise<Student[]> {
    const students = await this.prisma.user.findMany({
      where: {
        name: { contains: name, mode: 'insensitive' },
        username: { contains: username, mode: 'insensitive' },
      },
    })

    return students.map(PrismaStudentMapper.toEntity)
  }

  async create(student: Student): Promise<void> {
    const data = PrismaStudentMapper.toPrisma(student)
    await this.prisma.user.create({ data })
  }

  async save(student: Student): Promise<void> {
    const data = PrismaStudentMapper.toPrisma(student)

    await this.prisma.user.update({
      where: { id: student.id.toString() },
      data,
    })
  }

  async delete(student: Student): Promise<void> {
    await this.prisma.user.delete({
      where: { id: student.id.toString() },
    })
  }
}
