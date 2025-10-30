import type { Prisma, Project as ProjectRaw } from '@prisma/client'

import type { ProjectSummaryDTO } from '@/@core/domain/projects/application/dtos/project-summary.dto'
import type { ProjectDTO } from '@/@core/domain/projects/application/dtos/project.dto'
import { Project } from '@/@core/domain/projects/enterprise/entities/project'
import type { ProjectStatus } from '@/@core/domain/projects/enterprise/value-objects/project-status'
import { UniqueEntityID } from '@/@shared/kernel/kernel/unique-entity-id'

type PrismaProjectWithRelations = ProjectRaw & {
  author?: {
    name: string
    username: string
    profileUrl: string | null
  }
  subject?: {
    name: string
  } | null
  trails?: Array<{
    projectId: string
    trailId: string
    trail: {
      name: string
    }
  }>
  professors?: Array<{
    projectId: string
    professorId: string
    professor: {
      name: string
    }
  }>
}

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
        connect: { id: project.authorId.toString() },
      },
      subject: project.subjectId
        ? {
            connect: { id: project.subjectId.toString() },
          }
        : undefined,
      trails: {
        create: Array.from(project.trails).map(trailId => ({
          trail: {
            connect: { id: trailId.toString() },
          },
        })),
      },
      professors: {
        create: Array.from(project.professors).map(professorId => ({
          professor: {
            connect: { id: professorId.toString() },
          },
        })),
      },
    }
  }

  static toProjectDTO(raw: PrismaProjectWithRelations): ProjectDTO {
    return {
      id: raw.id,
      title: raw.title,
      description: raw.description ?? '',
      bannerUrl: raw.bannerUrl,
      content: raw.content,
      publishedYear: raw.publishedYear,
      status: raw.status as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED',
      semester: raw.semester,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      authorId: raw.authorId,
      author: raw.author
        ? {
            name: raw.author.name,
            username: raw.author.username,
            profileUrl: raw.author.profileUrl,
          }
        : { name: '', username: '', profileUrl: null },
      subjectId: raw.subjectId,
      subject: raw.subject ? { name: raw.subject.name } : null,
      trails: (raw.trails ?? []).map(t => ({ name: t.trail.name })),
      professors: (raw.professors ?? []).map(p => ({ name: p.professor.name })),
    }
  }

  static toProjectSummaryDTO(
    raw: PrismaProjectWithRelations,
  ): ProjectSummaryDTO {
    return {
      id: raw.id,
      title: raw.title,
      description: raw.description ?? '',
      bannerUrl: raw.bannerUrl,
      publishedYear: raw.publishedYear,
      semester: raw.semester,
      createdAt: raw.createdAt,
      author: raw.author
        ? {
            name: raw.author.name,
            username: raw.author.username,
            profileUrl: raw.author.profileUrl,
          }
        : { name: '', username: '', profileUrl: null },
      subject: raw.subject ? { name: raw.subject.name } : null,
      trails: (raw.trails ?? []).map(t => ({ name: t.trail.name })),
    }
  }
}
