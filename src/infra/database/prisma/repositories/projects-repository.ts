import type {
  ProjectQuery,
  ProjectsRepository,
} from '@/domain/deck/application/repositories/projects-repository.ts'
import type { Project } from '@/domain/deck/enterprise/entities/project.ts'
import type { ProjectDetails } from '@/domain/deck/enterprise/entities/value-objects/project-details.ts'
import { prisma } from '../client.ts'
import { PrismaProjectMapper } from '../mappers/prisma-project-mapper.ts'

export class PrismaProjectsRepository implements ProjectsRepository {
  async findById(id: string): Promise<Project | null> {
    const raw = await prisma.project.findUnique({
      where: {
        id,
      },
    })

    if (!raw) return null

    return PrismaProjectMapper.toEntity(raw)
  }

  async findDetailsById(id: string): Promise<ProjectDetails | null> {
    const raw = await prisma.project.findUnique({
      where: {
        id,
      },
      include: {
        author: {
          select: {
            name: true,
            username: true,
          },
        },
        professors: {
          select: {
            name: true,
          },
        },
        subject: {
          select: {
            name: true,
          },
        },
        trails: {
          select: {
            name: true,
          },
        },
      },
    })

    if (!raw) return null

    return PrismaProjectMapper.toEntityDetails(raw)
  }

  async findManyDetailsByQuery({
    title,
    semester,
    publishedYear,
    authorId,
    subjectId,
    trailsIds,
  }: ProjectQuery): Promise<ProjectDetails[]> {
    const raw = await prisma.project.findMany({
      where: {
        title: {
          contains: title,
        },
        publishedYear,
        authorId,
        subjectId,
        semester,
        trails: {
          some: {
            id: {
              in: trailsIds,
            },
          },
        },
      },
      include: {
        author: {
          select: {
            name: true,
            username: true,
          },
        },
        professors: {
          select: {
            name: true,
          },
        },
        subject: {
          select: {
            name: true,
          },
        },
        trails: {
          select: {
            name: true,
          },
        },
      },
    })

    return raw.map(PrismaProjectMapper.toEntityDetails)
  }

  async findAllByQuery({
    title,
    semester,
    publishedYear,
    authorId,
    subjectId,
    trailsIds,
  }: ProjectQuery): Promise<Project[]> {
    const raw = await prisma.project.findMany({
      where: {
        title: {
          contains: title,
        },
        semester,
        publishedYear,
        authorId,
        subjectId,
        trails: {
          some: {
            id: {
              in: trailsIds,
            },
          },
        },
      },
    })

    return raw.map(PrismaProjectMapper.toEntity)
  }

  async findAll(): Promise<Project[]> {
    const raw = await prisma.project.findMany()
    return raw.map(PrismaProjectMapper.toEntity)
  }

  async findAllDetails(): Promise<ProjectDetails[]> {
    const raw = await prisma.project.findMany({
      include: {
        author: {
          select: {
            name: true,
            username: true,
          },
        },
        professors: {
          select: {
            name: true,
          },
        },
        subject: {
          select: {
            name: true,
          },
        },
        trails: {
          select: {
            name: true,
          },
        },
      },
    })

    return raw.map(PrismaProjectMapper.toEntityDetails)
  }

  async create(project: Project): Promise<void> {
    const raw = PrismaProjectMapper.toPrisma(project)

    await prisma.project.create({
      data: raw,
    })
  }

  async save(project: Project): Promise<void> {
    const raw = PrismaProjectMapper.toPrisma(project)

    await prisma.project.update({
      where: {
        id: raw.id,
      },
      data: raw,
    })
  }

  async delete(id: string): Promise<void> {
    await prisma.project.delete({
      where: {
        id,
      },
    })
  }
}
