import type { Prisma, Project as ProjectRaw } from '@prisma/client'

import { Project } from '@/@core/domain/projects/enterprise/entities/project'
import type { ProjectStatus } from '@/@core/domain/projects/enterprise/value-objects/project-status'
import { UniqueEntityID } from '@/@shared/kernel/kernel/unique-entity-id'

// biome-ignore lint/complexity/noStaticOnlyClass: This class is a mapper and should have only static methods
export class PrismaProjectMapper {
  static toEntity(
    raw: ProjectRaw & {
      trails?: { id: string }[]
      professors?: { id: string }[]
    },
  ): Project {
    return Project.create(
      {
        title: raw.title,
        description: raw.description,
        content: raw.content ?? undefined,
        semester: raw.semester,
        publishedYear: raw.publishedYear,
        status: raw.status as ProjectStatus,
        allowComments: raw.allowComments,
        bannerUrl: raw.bannerUrl ?? undefined,
        authorId: UniqueEntityID.create(raw.authorId),
        subjectId: raw.subjectId
          ? UniqueEntityID.create(raw.subjectId)
          : undefined,
        trails: new Set(
          (raw.trails ?? []).map(t => UniqueEntityID.create(t.id)),
        ),
        professors: new Set(
          (raw.professors ?? []).map(p => UniqueEntityID.create(p.id)),
        ),
      },
      UniqueEntityID.create(raw.id),
    )
  }

  static toPrisma(project: Project): Prisma.ProjectCreateInput {
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
      author: {
        connect: { id: project.authorId.toString() }
      },
      subject: project.subjectId ? {
        connect: { id: project.subjectId.toString() }
      } : undefined,
      trails: {
        create: Array.from(project.trails).map(trailId => ({
          trail: {
            connect: { id: trailId.toString() }
          }
        })),
      },
      professors: {
        create: Array.from(project.professors).map(professorId => ({
          professor: {
            connect: { id: professorId.toString() }
          }
        })),
      },
    }
  }

  static toEntityPost(raw: any): any {
    const project = this.toEntity(raw)
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
      authorId: project.authorId.toString(),
      subjectId: project.subjectId?.toString(),
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      author: raw.author,
      subject: raw.subject,
      trails: raw.trails?.map((t: any) => t.trail) || [],
      professors: raw.professors?.map((p: any) => p.professor) || [],
    }
  }

  static toEntityDetails(raw: any): any {
    const project = this.toEntity(raw)
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
      authorId: project.authorId.toString(),
      subjectId: project.subjectId?.toString(),
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      author: raw.author,
      subject: raw.subject,
      trails: raw.trails?.map((t: any) => t.trail) || [],
      professors: raw.professors?.map((p: any) => p.professor) || [],
      comments: raw.comments || [],
    }
  }
}
