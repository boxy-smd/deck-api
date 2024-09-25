import type { Prisma, Project as ProjectRaw } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import { Project } from '@/domain/deck/enterprise/entities/project.ts'
import { CommentWithAuthor } from '@/domain/deck/enterprise/entities/value-objects/comment-with-author.ts'
import { Post } from '@/domain/deck/enterprise/entities/value-objects/post.ts'
import { ProjectDetails } from '@/domain/deck/enterprise/entities/value-objects/project-details.ts'

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
        profileUrl?: string | null
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
      comments: {
        id: string
        content: string
        createdAt: Date
        updatedAt: Date
        authorId: string
        author: {
          name: string
          username: string
          profileUrl: string | null
        }
      }[]
    },
  ): ProjectDetails {
    return ProjectDetails.create({
      id: new UniqueEntityID(raw.id),
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
        profileUrl: raw.author.profileUrl ?? undefined,
      },
      subject: raw.subject?.name,
      subjectId: raw.subjectId ? new UniqueEntityID(raw.subjectId) : undefined,
      trails: raw.trails.map(trail => trail.name),
      professors: raw.professors?.map(professor => professor.name),
      comments: raw.comments.map(comment =>
        CommentWithAuthor.create({
          id: new UniqueEntityID(comment.id),
          content: comment.content,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          authorId: new UniqueEntityID(comment.authorId),
          author: {
            name: comment.author.name,
            username: comment.author.username,
            profileUrl: comment.author.profileUrl ?? undefined,
          },
        }),
      ),
    })
  }

  static toEntityPost(
    raw: ProjectRaw & {
      author: {
        name: string
        username: string
        profileUrl?: string | null
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
  ): Post {
    return Post.create({
      id: new UniqueEntityID(raw.id),
      title: raw.title,
      description: raw.description,
      bannerUrl: raw.bannerUrl ?? undefined,
      content: raw.content ?? undefined,
      publishedYear: raw.publishedYear,
      status: raw.status,
      semester: raw.semester,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      author: {
        name: raw.author.name,
        username: raw.author.username,
        profileUrl: raw.author.profileUrl ?? undefined,
      },
      authorId: new UniqueEntityID(raw.authorId),
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
      content: project.content,
      semester: project.semester,
      publishedYear: project.publishedYear,
      status: project.status,
      allowComments: project.allowComments,
      bannerUrl: project.bannerUrl,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
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
