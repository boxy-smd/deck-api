import type {
  ProjectQuery,
  ProjectsRepository,
} from '@/domain/projects/application/repositories/projects-repository'
import type { Project } from '@/domain/projects/enterprise/entities/project'
import type { Post } from '@/domain/projects/enterprise/value-objects/post'
import { prisma } from '../client'
import { PrismaProjectMapper } from '../mappers/prisma-project-mapper'

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

  async findManyByQuery(_query: ProjectQuery): Promise<Project[]> {
    return new Promise<Project[]>((_resolve, _reject) => {
      throw new Error('Method not implemented.')
    })
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

  async findById(id: string): Promise<Project | null> {
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

    // Attach related data for presenters
    ;(project as any).__author = data.author
    ;(project as any).__subject = data.subject?.name
    ;(project as any).__trails = data.trails.map(t => t.trail.name)
    ;(project as any).__professors = data.professors.map(p => p.professor.name)
    ;(project as any).__comments = data.comments

    return project
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
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return data.map(d => PrismaProjectMapper.toEntityPost(d))
  }

  async findManyPostsByProfessorName(name: string): Promise<Post[]> {
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
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return data.map(d => PrismaProjectMapper.toEntityPost(d))
  }

  async findManyDraftsByStudentId(studentId: string): Promise<Post[]> {
    const data = await prisma.project.findMany({
      where: {
        authorId: studentId,
        status: 'DRAFT',
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
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return data.map(d => PrismaProjectMapper.toEntityPost(d))
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
                    trailId: {
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
      },
      orderBy: {
        publishedYear: 'desc',
      },
    })

    return data.map(d => PrismaProjectMapper.toEntityPost(d))
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
      },
      orderBy: {
        publishedYear: 'desc',
      },
    })

    return data.map(d => PrismaProjectMapper.toEntityPost(d))
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
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return data.map(d => PrismaProjectMapper.toEntityPost(d))
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
      },
      where: {
        status: 'PUBLISHED',
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return data.map(d => PrismaProjectMapper.toEntityPost(d))
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
