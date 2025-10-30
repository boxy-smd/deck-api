import type { Prisma } from '@prisma/client'

export class PrismaQueryBuilder {
  static buildProjectFilters(filters: {
    publishedYear?: number
    semester?: number
    subjectId?: string
    trailsIds?: string[]
    status?: string
  }): Prisma.ProjectWhereInput {
    const conditions: Prisma.ProjectWhereInput[] = []

    if (filters.publishedYear !== undefined) {
      conditions.push({
        publishedYear: { equals: filters.publishedYear },
      })
    }

    if (filters.semester !== undefined) {
      conditions.push({
        semester: { equals: filters.semester },
      })
    }

    if (filters.subjectId) {
      conditions.push({
        subjectId: { equals: filters.subjectId },
      })
    }

    if (filters.trailsIds && filters.trailsIds.length > 0) {
      conditions.push({
        trails: {
          some: {
            trailId: { in: filters.trailsIds },
          },
        },
      })
    }

    if (filters.status) {
      conditions.push({
        status: { equals: filters.status as any },
      })
    }

    return conditions.length > 0 ? { AND: conditions } : {}
  }

  static buildPagination(params: {
    page?: number
    limit?: number
  }): {
    skip: number
    take: number
  } {
    const page = params.page ?? 1
    const limit = params.limit ?? 20

    return {
      skip: (page - 1) * limit,
      take: limit,
    }
  }

  static getProjectDTOIncludes(): Prisma.ProjectInclude {
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

  static getProjectFullIncludes(): Prisma.ProjectInclude {
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
          projectId: true,
          professorId: true,
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
          projectId: true,
          trailId: true,
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
    }
  }
}
