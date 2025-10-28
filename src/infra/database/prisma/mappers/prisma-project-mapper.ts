import type { Prisma, Project as ProjectRaw } from '@prisma/client'

import { Project } from '@/domain/projects/enterprise/entities/project.ts'
import type { ProjectStatus } from '@/domain/projects/enterprise/value-objects/project-status.ts'
import { UniqueEntityID } from '@/shared/kernel/unique-entity-id.ts'

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
      authorId: project.authorId.toString(),
      subjectId: project.subjectId?.toString(),
      trails: {
        connect: Array.from(project.trails).map(trailId => ({
          id: trailId.toString(),
        })),
      },
      professors: {
        connect: Array.from(project.professors).map(professorId => ({
          id: professorId.toString(),
        })),
      },
    }
  }
}
