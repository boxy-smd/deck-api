import type { UsersRepository } from '@/@core/application/users/repositories/users-repository'
import type { User } from '@/@core/domain/users/entities/user'
import { Injectable } from '@nestjs/common'
import { PrismaStudentMapper } from '../mappers/prisma-student-mapper'
import type { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaStudentsRepository implements UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const student = await this.prisma.user.findUnique({
      where: { id },
      include: {
        trail: {
          include: {
            trail: true,
          },
        },
        studentProfile: true,
      },
    })

    if (!student) return null

    return PrismaStudentMapper.toEntity(student)
  }

  async findByName(name: string): Promise<User | null> {
    const student = await this.prisma.user.findFirst({
      where: { name },
      include: {
        trail: {
          include: {
            trail: true,
          },
        },
        studentProfile: true,
      },
    })

    if (!student) return null

    return PrismaStudentMapper.toEntity(student)
  }

  async findByEmail(email: string): Promise<User | null> {
    const student = await this.prisma.user.findFirst({
      where: { email },
      include: {
        trail: {
          include: {
            trail: true,
          },
        },
        studentProfile: true,
      },
    })

    if (!student) return null

    return PrismaStudentMapper.toEntity(student)
  }

  async findByUsername(username: string): Promise<User | null> {
    const student = await this.prisma.user.findFirst({
      where: { username },
      include: {
        trail: {
          include: {
            trail: true,
          },
        },
        studentProfile: true,
      },
    })

    if (!student) return null

    return PrismaStudentMapper.toEntity(student)
  }

  async findManyByName(name: string): Promise<User[]> {
    const students = await this.prisma.user.findMany({
      where: {
        name: { contains: name, mode: 'insensitive' },
        username: name.startsWith('@')
          ? { contains: name.slice(1), mode: 'insensitive' }
          : undefined,
      },
      include: {
        trail: {
          include: {
            trail: true,
          },
        },
        studentProfile: true,
      },
    })

    return students.map(s => PrismaStudentMapper.toEntity(s))
  }

  async findAll(): Promise<User[]> {
    const students = await this.prisma.user.findMany({
      include: {
        trail: {
          include: {
            trail: true,
          },
        },
        studentProfile: true,
      },
    })

    return students.map(s => PrismaStudentMapper.toEntity(s))
  }

  async existsById(id: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { id },
    })

    return count > 0
  }

  async create(student: User): Promise<void> {
    const data = PrismaStudentMapper.toPrisma(student)
    await this.prisma.user.create({ data })
  }

  async save(student: User): Promise<void> {
    const data = PrismaStudentMapper.toPrismaUpdate(student)

    await this.prisma.user.update({
      where: { id: student.id.toString() },
      data,
    })
  }

  async delete(student: User): Promise<void> {
    await this.prisma.user.delete({
      where: { id: student.id.toString() },
    })
  }

  async deleteById(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    })
  }
}
