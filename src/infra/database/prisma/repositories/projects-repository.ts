import type {
  ProjectQuery,
  ProjectsRepository,
} from '@/domain/deck/application/repositories/projects-repository.ts'
import type { Project } from '@/domain/deck/enterprise/entities/project.ts'
import type { Post } from '@/domain/deck/enterprise/entities/value-objects/post.ts'
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

    return PrismaProjectMapper.toEntityDetails(data)
  }

  async findManyPostsByTitle(title: string): Promise<Post[]> {
    const data = await prisma.project.findMany({
      where: {
        title: {
          contains: title,
          mode: 'insensitive',
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

    return data.map(PrismaProjectMapper.toEntityPost)
  }

  async findManyPostsByProfessorName(name: string): Promise<Post[]> {
    const data = await prisma.project.findMany({
      where: {
        professors: {
          some: {
            name: {
              contains: name,
              mode: 'insensitive',
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

    return data.map(PrismaProjectMapper.toEntityPost)
  }

  async findManyPostsByQuery({
    semester,
    publishedYear,
    subjectId,
    trailsIds,
  }: ProjectQuery): Promise<Post[]> {
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
                    id: {
                      in: trailsIds,
                    },
                  },
                },
              }
            : {},
        ],
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

    return data.map(PrismaProjectMapper.toEntityPost)
  }

  async findManyPostsByTag(tag: string): Promise<Post[]> {
    const semesterVariants: Record<number, string[]> = {
      1: ['1', 'primeiro', '1º'],
      2: ['2', 'segundo', '2º'],
      3: ['3', 'terceiro', '3º'],
      4: ['4', 'quarto', '4º'],
      5: ['5', 'quinto', '5º'],
      6: ['6', 'sexto', '6º'],
      7: ['7', 'sétimo', 'setimo', '7º'],
      8: ['8', 'oitavo', '8º'],
      9: ['9', 'nono', '9º'],
      10: ['10', 'décimo', 'decimo', '10º'],
      11: [
        '11',
        'décimo primeiro',
        'decimo primeiro',
        'décimo-primeiro',
        'decimo-primeiro',
        '11º',
      ],
      12: [
        '12',
        'décimo segundo',
        'decimo segundo',
        'décimo-segundo',
        'decimo-segundo',
        '12º',
      ],
    }

    let searchedSemester: number | undefined = undefined

    for (const key in semesterVariants) {
      const variants = semesterVariants[key]

      if (variants.includes(tag.toLowerCase())) {
        searchedSemester = Number.parseInt(key)

        break
      }
    }

    const data = await prisma.project.findMany({
      where: {
        OR: [
          {
            trails: {
              some: {
                name: {
                  contains: tag,
                  mode: 'insensitive',
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
          Number.parseInt(tag)
            ? {
                publishedYear: {
                  equals: Number.parseInt(tag),
                },
              }
            : {},
          searchedSemester
            ? {
                semester: {
                  equals: searchedSemester,
                },
              }
            : {},
        ],
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

    return data.map(PrismaProjectMapper.toEntityPost)
  }

  async findManyPostsByStudentId(studentId: string): Promise<Post[]> {
    const data = await prisma.project.findMany({
      where: {
        authorId: studentId,
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

    return data.map(PrismaProjectMapper.toEntityPost)
  }

  async findAll(): Promise<Project[]> {
    const data = await prisma.project.findMany()
    return data.map(PrismaProjectMapper.toEntity)
  }

  async findAllPosts(): Promise<Post[]> {
    const data = await prisma.project.findMany({
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
      where: {
        status: 'PUBLISHED',
      },
      orderBy: {
        publishedYear: 'desc',
      },
    })

    return data.map(PrismaProjectMapper.toEntityPost)
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
