import { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import { Project } from '@/domain/deck/enterprise/entities/project.ts'
import { ProjectDetails } from '@/domain/deck/enterprise/entities/value-objects/project-details.ts'
import type { Prisma, Project as ProjectRaw } from '@prisma/client'

// biome-ignore lint/complexity/noStaticOnlyClass: This class is a mapper and should have only static methods
export class PrismaProjectMapper {
  static toEntity(raw: ProjectRaw): Project {
    return Project.create(
      {
        title: raw.title,
        description: raw.description,
        content: raw.content ?? undefined,
        semester: raw.semester,
        publishedYear: raw.publishedYear,
        status: raw.status,
        allowComments: raw.allowComments,
        bannerUrl: raw.bannerUrl ?? undefined,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        authorId: new UniqueEntityID(raw.authorId),
        trails: [],
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toEntityDetails(
    raw: ProjectRaw & {
      author: {
        name: string
        username: string
      }
      subject?: {
        name: string
      } | null
      professors?: {
        name: string
      }[]
      trails: {
        name: string
      }[]
    },
  ): ProjectDetails {
    return ProjectDetails.create({
      title: raw.title,
      description: raw.description,
      content: raw.content ?? undefined,
      semester: raw.semester,
      publishedYear: raw.publishedYear,
      status: raw.status,
      allowComments: raw.allowComments,
      bannerUrl: raw.bannerUrl ?? undefined,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      authorId: new UniqueEntityID(raw.authorId),
      author: {
        name: raw.author.name,
        username: raw.author.username,
      },
      subject: raw.subject?.name,
      subjectId: raw.subjectId ? new UniqueEntityID(raw.subjectId) : undefined,
      trails: raw.trails.map(trail => trail.name),
      professors: raw.professors?.map(professor => professor.name),
    })
  }

  static toPrisma(project: Project): Prisma.ProjectUncheckedCreateInput {
    return {
      id: project.id.toString(),
      title: project.title,
      description: project.description,
      content: project.content ?? undefined,
      semester: project.semester,
      publishedYear: project.publishedYear,
      status: project.status,
      allowComments: project.allowComments,
      bannerUrl: project.bannerUrl ?? undefined,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt ?? undefined,
      authorId: project.authorId.toString(),
      trails: {
        connect: project.trails.map(trail => ({ id: trail.id.toString() })),
      },
      subjectId: project.subjectId?.toString(),
      comments: {
        connect: project.comments?.map(comment => ({
          id: comment.id.toString(),
        })),
      },
      professors: {
        connect: project.professors?.map(professor => ({
          id: professor.id.toString(),
        })),
      },
    }
  }
}
