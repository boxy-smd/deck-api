import type { Draft as DraftRaw, Prisma } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import { Draft } from '@/domain/deck/enterprise/entities/draft.ts'
import { Professor } from '@/domain/deck/enterprise/entities/professor.ts'
import { Trail } from '@/domain/deck/enterprise/entities/trail.ts'

// biome-ignore lint/complexity/noStaticOnlyClass: This class is a mapper and should have only static methods
export class PrismaDraftMapper {
  static toEntity(
    raw: DraftRaw & {
      trails: { id: string; name: string }[]
      professors: { id: string; name: string }[]
    },
  ): Draft {
    return Draft.create(
      {
        title: raw.title,
        description: raw.description ?? undefined,
        content: raw.content ?? undefined,
        semester: raw.semester ?? undefined,
        publishedYear: raw.publishedYear ?? undefined,
        allowComments: raw.allowComments ?? undefined,
        bannerUrl: raw.bannerUrl ?? undefined,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt ?? undefined,
        authorId: new UniqueEntityID(raw.authorId),
        subjectId: raw.subjectId
          ? new UniqueEntityID(raw.subjectId)
          : undefined,
        trails: raw.trails.map(trail =>
          Trail.create(
            {
              name: trail.name,
            },
            new UniqueEntityID(trail.id),
          ),
        ),
        professors: raw.professors.map(professor =>
          Professor.create(
            {
              name: professor.name,
            },
            new UniqueEntityID(professor.id),
          ),
        ),
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(draft: Draft): Prisma.DraftUncheckedCreateInput {
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
        connect: draft.trails?.map(trail => ({ id: trail.id.toString() })),
      },
      subjectId: draft.subjectId?.toString(),
      professors: {
        connect: draft.professors?.map(professor => ({
          id: professor.id.toString(),
        })),
      },
    }
  }

  static toPrismaUpdate(draft: Draft): Prisma.DraftUncheckedUpdateInput {
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
        set: draft.trails?.map(trail => ({ id: trail.id.toString() })),
      },
      subjectId: draft.subjectId?.toString(),
      professors: {
        set: draft.professors?.map(professor => ({
          id: professor.id.toString(),
        })),
      },
    }
  }
}
