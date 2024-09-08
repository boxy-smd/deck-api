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
    const data = await prisma.project.findUnique({
      where: {
        id,
      },
    })

    if (!data) return null

    return PrismaProjectMapper.toEntity(data)
  }

  async findDetailsById(id: string): Promise<ProjectDetails | null> {
    const data = await prisma.project.findUnique({
      where: {
        id,
      },
      include: {
        author: {
          select: {
            name: true,
            username: true,
            profileUrl: true,
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

    if (!data) return null

    return PrismaProjectMapper.toEntityDetails(data)
  }

  async findManyDetailsByQuery({
    title,
    semester,
    publishedYear,
    authorId,
    subjectId,
    trailsIds,
  }: ProjectQuery): Promise<ProjectDetails[]> {
    const data = await prisma.project.findMany({
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
            profileUrl: true,
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

    return data.map(PrismaProjectMapper.toEntityDetails)
  }

  async findAllByQuery({
    title,
    semester,
    publishedYear,
    authorId,
    subjectId,
    trailsIds,
  }: ProjectQuery): Promise<Project[]> {
    const data = await prisma.project.findMany({
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

    return data.map(PrismaProjectMapper.toEntity)
  }

  async findAll(): Promise<Project[]> {
    const data = await prisma.project.findMany()
    return data.map(PrismaProjectMapper.toEntity)
  }

  async findAllDetails(): Promise<ProjectDetails[]> {
    const data = await prisma.project.findMany({
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

    return data.map(PrismaProjectMapper.toEntityDetails)
  }

  async create(project: Project): Promise<void> {
    const data = PrismaProjectMapper.toPrisma(project)

    await prisma.project.create({
      data,
    })
  }

  async save(project: Project): Promise<void> {
    const data = PrismaProjectMapper.toPrisma(project)

    await prisma.project.update({
      where: {
        id: data.id,
      },
      data,
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
