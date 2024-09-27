import { randomUUID } from 'node:crypto'

import type { DraftsRepository } from '@/domain/deck/application/repositories/drafts-repository.ts'
import type { Draft } from '@/domain/deck/enterprise/entities/draft.ts'
import { prisma } from '../client.ts'
import { PrismaDraftMapper } from '../mappers/prisma-draft-mapper.ts'

export class PrismaDraftsRepository implements DraftsRepository {
  async findById(id: string): Promise<Draft | null> {
    const data = await prisma.draft.findUnique({
      where: {
        id,
      },
      include: {
        trails: {
          select: {
            id: true,
            name: true,
          },
        },
        professors: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    if (!data) return null

    return PrismaDraftMapper.toEntity(data)
  }

  async findManyByAuthorId(authorId: string): Promise<Draft[]> {
    const data = await prisma.draft.findMany({
      where: {
        authorId,
      },
      include: {
        trails: {
          select: {
            id: true,
            name: true,
          },
        },
        professors: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return data.map(PrismaDraftMapper.toEntity)
  }

  async create(draft: Draft): Promise<void> {
    const data = PrismaDraftMapper.toPrisma(draft)

    await prisma.draft.create({
      data: {
        id: randomUUID(),
        ...data,
      },
    })
  }

  async save(draft: Draft): Promise<void> {
    const data = PrismaDraftMapper.toPrismaUpdate(draft)

    await prisma.draft.update({
      where: {
        id: draft.id.toString(),
      },
      data,
    })
  }

  async delete(id: string): Promise<void> {
    await prisma.draft.delete({
      where: {
        id,
      },
    })
  }
}
