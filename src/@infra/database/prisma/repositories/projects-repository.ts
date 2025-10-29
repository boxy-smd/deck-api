import type { ProjectDTO } from '@/@core/domain/projects/application/dtos/project.dto'
import type {
  ProjectQuery,
  ProjectsRepository,
} from '@/@core/domain/projects/application/repositories/projects-repository'
import type { Project } from '@/@core/domain/projects/enterprise/entities/project'
import { SemesterParser } from '@/@shared/kernel/utils/semester-parser'
import { prisma } from '../client'
import { PrismaProjectMapper } from '../mappers/prisma-project-mapper'
import type { ProjectWithMetadata } from '../mappers/project-with-metadata'

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
    const data = await prisma.project.findMany({
      where: {
        AND: [
          query.publishedYear
            ? {
                publishedYear: {
                  equals: query.publishedYear,
                },
              }
            : {},
          query.semester
            ? {
                semester: {
                  equals: query.semester,
                },
              }
            : {},
          query.subjectId
            ? {
                subjectId: {
                  equals: query.subjectId,
                },
              }
            : {},
          query.trailsIds?.length
            ? {
                trails: {
                  some: {
                    trailId: {
                      in: query.trailsIds,
                    },
                  },
                },
              }
            : {},
        ],
      },
    })

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
    const data = await prisma.project.findUnique({
      where: {
        id: id.toString(),
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
            professor: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        subject: {
          select: {
            name: true,
          },
        },
        trails: {
          select: {
            trail: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            updatedAt: true,
            author: {
              select: {
                name: true,
                username: true,
                profileUrl: true,
              },
            },
            authorId: true,
          },
        },
      },
    })

    if (!data) return null

    const project = PrismaProjectMapper.toEntity({
      ...data,
      trails: data.trails.map(t => ({ id: t.trail.id })),
      professors: data.professors.map(p => ({ id: p.professor.id })),
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

  async findAllPosts(): Promise<ProjectDTO[]> {
    return this.findAllProjectDTOs()
  }

  async findAllProjectDTOs(): Promise<ProjectDTO[]> {
    const data = await prisma.project.findMany({
      include: this.getProjectDTOIncludes(),
      where: {
        status: 'PUBLISHED',
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return data.map(d => PrismaProjectMapper.toProjectDTO(d))
  }

  private getProjectDTOIncludes() {
    return {
      author: {
        select: {
          name: true,
          username: true,
          profileUrl: true,
        },
      },
      professors: {
        select: {
          professor: {
            select: {
              name: true,
            },
          },
        },
      },
      subject: {
        select: {
          name: true,
        },
      },
      trails: {
        select: {
          trail: {
            select: {
              name: true,
            },
          },
        },
      },
    }
  }

  async findManyProjectDTOsByTitle(title: string): Promise<ProjectDTO[]> {
    const data = await prisma.project.findMany({
      where: {
        title: {
          contains: title,
          mode: 'insensitive',
        },
      },
      include: this.getProjectDTOIncludes(),
      orderBy: {
        createdAt: 'desc',
      },
    })

    return data.map(d => PrismaProjectMapper.toProjectDTO(d))
  }

  async findManyProjectDTOsByProfessorName(
    name: string,
  ): Promise<ProjectDTO[]> {
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
      include: this.getProjectDTOIncludes(),
      orderBy: {
        createdAt: 'desc',
      },
    })

    return data.map(d => PrismaProjectMapper.toProjectDTO(d))
  }

  async findManyProjectDTOsByQuery({
    semester,
    publishedYear,
    subjectId,
    trailsIds,
  }: ProjectQuery): Promise<ProjectDTO[]> {
    const data = await prisma.project.findMany({
      where: {
        AND: [
          {
            status: 'PUBLISHED',
          },
          publishedYear
            ? {
                publishedYear: {
                  equals: publishedYear,
                },
              }
            : {},
          semester
            ? {
                semester: {
                  equals: semester,
                },
              }
            : {},
          subjectId
            ? {
                subjectId: {
                  equals: subjectId,
                },
              }
            : {},
          trailsIds?.length
            ? {
                trails: {
                  some: {
                    trailId: {
                      in: trailsIds,
                    },
                  },
                },
              }
            : {},
        ],
      },
      include: this.getProjectDTOIncludes(),
      orderBy: {
        publishedYear: 'desc',
      },
    })

    return data.map(d => PrismaProjectMapper.toProjectDTO(d))
  }

  async findManyProjectDTOsByTag(tag: string): Promise<ProjectDTO[]> {
    const parsedSemester = SemesterParser.parseSemester(tag)
    const parsedYear = Number.parseInt(tag, 10)

    const data = await prisma.project.findMany({
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
            ? {} : {
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
      include: this.getProjectDTOIncludes(),
      orderBy: {
        publishedYear: 'desc',
      },
    })

    return data.map(d => PrismaProjectMapper.toProjectDTO(d))
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

  async delete(project: Project): Promise<void> {
    await prisma.project.delete({
      where: {
        id: project.id.toString(),
      },
    })
  }

  async deleteById(id: string): Promise<void> {
    await prisma.project.delete({
      where: {
        id: id.toString(),
      },
    })
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
