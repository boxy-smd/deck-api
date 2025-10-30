import type { ProjectDTO } from '@/@core/domain/projects/application/dtos/project.dto'
import type {
  ProjectQuery,
  ProjectsRepository,
} from '@/@core/domain/projects/application/repositories/projects-repository'
import type { Project } from '@/@core/domain/projects/enterprise/entities/project'
import { SemesterParser } from '@/@shared/kernel/utils/semester-parser'
import { prisma } from '../client'
import { PrismaErrorHandler } from '../error-handler'
import { PrismaProjectMapper } from '../mappers/prisma-project-mapper'
import type { ProjectWithMetadata } from '../mappers/project-with-metadata'
import { PrismaQueryBuilder } from '../query-builder'
import type { } from '../types/prisma-types'

export class PrismaProjectsRepository implements ProjectsRepository {
  async findManyByTitle(title: string): Promise<Project[]> {
    const data = await prisma.project.findMany({
      where: {
        title: {
          contains: title,
          mode: 'insensitive',
        },
      },
    })

    return data.map(PrismaProjectMapper.toEntity)
  }

  async findManyByProfessorName(name: string): Promise<Project[]> {
    const data = await prisma.project.findMany({
      where: {
        professors: {
          some: {
            professor: {
              name: {
                contains: name,
                mode: 'insensitive',
              },
            },
          },
        },
      },
    })

    return data.map(PrismaProjectMapper.toEntity)
  }

  async findManyByQuery(query: ProjectQuery): Promise<Project[]> {
    const where = PrismaQueryBuilder.buildProjectFilters({
      publishedYear: query.publishedYear,
      semester: query.semester,
      subjectId: query.subjectId,
      trailsIds: query.trailsIds,
    })

    const data = await PrismaErrorHandler.execute(() =>
      prisma.project.findMany({ where }),
    )

    return data.map(PrismaProjectMapper.toEntity)
  }

  async findManyByAuthorId(authorId: string): Promise<Project[]> {
    const data = await prisma.project.findMany({
      where: {
        authorId: authorId.toString(),
      },
    })

    return data.map(PrismaProjectMapper.toEntity)
  }

  async findManyByStudentId(studentId: string): Promise<Project[]> {
    const data = await prisma.project.findMany({
      where: {
        authorId: studentId.toString(),
      },
    })

    return data.map(PrismaProjectMapper.toEntity)
  }

  async findManyByTag(tag: string): Promise<Project[]> {
    const data = await prisma.project.findMany({
      where: {
        trails: {
          some: {
            trail: {
              name: {
                contains: tag,
                mode: 'insensitive',
              },
            },
          },
        },
      },
    })

    return data.map(PrismaProjectMapper.toEntity)
  }

  async findById(id: string): Promise<(Project & ProjectWithMetadata) | null> {
    const data = await PrismaErrorHandler.execute(() =>
      prisma.project.findUnique({
        where: { id: id.toString() },
        include: PrismaQueryBuilder.getProjectFullIncludes(),
      }),
    )

    if (!data) return null

    const project = PrismaProjectMapper.toEntity({
      ...data,
      trails: data.trails,
      professors: data.professors,
    })

    const projectWithMetadata: Project & ProjectWithMetadata = Object.assign(
      project,
      {
        metadata: {
          author: data.author,
          subject: data.subject?.name,
          trails: data.trails.map(t => t.trail.name),
          professors: data.professors.map(p => p.professor.name),
          comments: data.comments,
        },
      },
    )

    return projectWithMetadata
  }

  async findAll(): Promise<Project[]> {
    const data = await prisma.project.findMany()
    return data.map(PrismaProjectMapper.toEntity)
  }

  async findAllProjectDTOs(): Promise<ProjectDTO[]> {
    const data = await PrismaErrorHandler.execute(() =>
      prisma.project.findMany({
        include: PrismaQueryBuilder.getProjectDTOIncludes(),
        where: { status: 'PUBLISHED' },
        orderBy: { createdAt: 'desc' },
      }),
    )

    return data.map(PrismaProjectMapper.toProjectDTO)
  }

  async findManyProjectDTOsByTitle(title: string): Promise<ProjectDTO[]> {
    const data = await PrismaErrorHandler.execute(() =>
      prisma.project.findMany({
        where: {
          title: {
            contains: title,
            mode: 'insensitive',
          },
        },
        include: PrismaQueryBuilder.getProjectDTOIncludes(),
        orderBy: { createdAt: 'desc' },
      }),
    )

    return data.map(PrismaProjectMapper.toProjectDTO)
  }

  async findManyProjectDTOsByProfessorName(
    name: string,
  ): Promise<ProjectDTO[]> {
    const data = await PrismaErrorHandler.execute(() =>
      prisma.project.findMany({
        where: {
          professors: {
            some: {
              professor: {
                name: {
                  contains: name,
                  mode: 'insensitive',
                },
              },
            },
          },
        },
        include: PrismaQueryBuilder.getProjectDTOIncludes(),
        orderBy: { createdAt: 'desc' },
      }),
    )

    return data.map(PrismaProjectMapper.toProjectDTO)
  }

  async findManyProjectDTOsByQuery({
    semester,
    publishedYear,
    subjectId,
    trailsIds,
  }: ProjectQuery): Promise<ProjectDTO[]> {
    const where = PrismaQueryBuilder.buildProjectFilters({
      publishedYear,
      semester,
      subjectId,
      trailsIds,
      status: 'PUBLISHED',
    })

    const data = await PrismaErrorHandler.execute(() =>
      prisma.project.findMany({
        where,
        include: PrismaQueryBuilder.getProjectDTOIncludes(),
        orderBy: { publishedYear: 'desc' },
      }),
    )

    return data.map(PrismaProjectMapper.toProjectDTO)
  }

  async findManyProjectDTOsByTag(tag: string): Promise<ProjectDTO[]> {
    const parsedSemester = SemesterParser.parseSemester(tag)
    const parsedYear = Number.parseInt(tag, 10)

    const data = await PrismaErrorHandler.execute(() =>
      prisma.project.findMany({
        where: {
          OR: [
            {
              trails: {
                some: {
                  trail: {
                    name: {
                      contains: tag,
                      mode: 'insensitive',
                    },
                  },
                },
              },
            },
            {
              subject: {
                name: {
                  contains: tag,
                  mode: 'insensitive',
                },
              },
            },
            Number.isNaN(parsedYear)
              ? {}
              : {
                  publishedYear: {
                    equals: parsedYear,
                  },
                },
            parsedSemester
              ? {
                  semester: {
                    equals: parsedSemester,
                  },
                }
              : {},
          ],
        },
        include: PrismaQueryBuilder.getProjectDTOIncludes(),
        orderBy: { publishedYear: 'desc' },
      }),
    )

    return data.map(PrismaProjectMapper.toProjectDTO)
  }

  async create(project: Project): Promise<void> {
    const data = PrismaProjectMapper.toPrisma(project)

    await PrismaErrorHandler.execute(() => prisma.project.create({ data }))
  }

  async save(project: Project): Promise<void> {
    const data = PrismaProjectMapper.toPrisma(project)

    await PrismaErrorHandler.execute(() =>
      prisma.project.update({
        where: { id: data.id },
        data,
      }),
    )
  }

  async delete(project: Project): Promise<void> {
    await PrismaErrorHandler.execute(() =>
      prisma.project.delete({
        where: { id: project.id.toString() },
      }),
    )
  }

  async deleteById(id: string): Promise<void> {
    await PrismaErrorHandler.execute(() =>
      prisma.project.delete({
        where: { id: id.toString() },
      }),
    )
  }

  async existsById(id: string): Promise<boolean> {
    const data = await prisma.project.findUnique({
      where: {
        id: id.toString(),
      },
      select: {
        id: true,
      },
    })

    return !!data
  }
}
