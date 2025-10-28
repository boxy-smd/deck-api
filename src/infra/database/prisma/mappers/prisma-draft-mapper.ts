import type { Draft as DraftRaw, Prisma } from '@prisma/client'

import { Project } from '@/domain/projects/enterprise/entities/project.ts'
import { ProjectStatus } from '@/domain/projects/enterprise/value-objects/project-status.ts'
import { UniqueEntityID } from '@/shared/kernel/unique-entity-id.ts'

// biome-ignore lint/complexity/noStaticOnlyClass: This class is a mapper and should have only static methods
export class PrismaDraftMapper {
  static toEntity(
    raw: DraftRaw & {
      trails: { id: string; name: string }[]
      professors: { id: string; name: string }[]
    },
  ): Project {
    return Project.create(
      {
        title: raw.title,
        description: raw.description ?? undefined,
        content: raw.content ?? undefined,
        semester: raw.semester ?? undefined,
        publishedYear: raw.publishedYear ?? undefined,
        allowComments: raw.allowComments ?? true,
        bannerUrl: raw.bannerUrl ?? undefined,
        status: ProjectStatus.DRAFT,
        authorId: UniqueEntityID.create(raw.authorId),
        subjectId: raw.subjectId
          ? UniqueEntityID.create(raw.subjectId)
          : undefined,
        trails: new Set(
          raw.trails.map(trail => UniqueEntityID.create(trail.id)),
        ),
        professors: new Set(
          raw.professors.map(professor => UniqueEntityID.create(professor.id)),
        ),
      },
      UniqueEntityID.create(raw.id),
    )
  }

  static toPrisma(draft: Project): Prisma.DraftUncheckedCreateInput {
    return {
      id: draft.id.toString(),
      title: draft.title,
      description: draft.description,
      content: draft.content ?? undefined,
      semester: draft.semester,
      publishedYear: draft.publishedYear,
      allowComments: draft.allowComments,
      bannerUrl: draft.bannerUrl ?? undefined,
      createdAt: draft.createdAt,
      updatedAt: draft.updatedAt ?? undefined,
      authorId: draft.authorId.toString(),
      trails: {
        connect: Array.from(draft.trails).map(trailId => ({
          id: trailId.toString(),
        })),
      },
      subjectId: draft.subjectId?.toString(),
      professors: {
        connect: Array.from(draft.professors).map(professorId => ({
          id: professorId.toString(),
        })),
      },
    }
  }

  static toPrismaUpdate(draft: Project): Prisma.DraftUncheckedUpdateInput {
    return {
      title: draft.title,
      description: draft.description,
      content: draft.content ?? undefined,
      semester: draft.semester,
      publishedYear: draft.publishedYear,
      allowComments: draft.allowComments,
      bannerUrl: draft.bannerUrl ?? undefined,
      updatedAt: draft.updatedAt,
      authorId: draft.authorId.toString(),
      trails: {
        set: Array.from(draft.trails).map(trailId => ({
          id: trailId.toString(),
        })),
      },
      subjectId: draft.subjectId?.toString(),
      professors: {
        set: Array.from(draft.professors).map(professorId => ({
          id: professorId.toString(),
        })),
      },
    }
  }
}
