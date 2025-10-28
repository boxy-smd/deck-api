import { randomUUID } from 'node:crypto'

import type { ProjectsRepository } from '@/domain/projects/application/repositories/projects-repository.ts'
import type { Project } from '@/domain/projects/enterprise/entities/project.ts'
import { ProjectStatus } from '@/domain/projects/enterprise/value-objects/project-status.ts'
import { prisma } from '../client.ts'
import { PrismaProjectMapper } from '../mappers/prisma-project-mapper.ts'

// Este repositório lida especificamente com drafts (projetos com status DRAFT)
export class PrismaDraftsRepository implements ProjectsRepository {
  async findById(id: string): Promise<Project | null> {
    const data = await prisma.project.findUnique({
      where: {
        id,
        status: 'DRAFT',
      },
      include: {
        trails: {
          select: {
            trailId: true,
          },
        },
        professors: {
          select: {
            professorId: true,
          },
        },
      },
    })

    if (!data) return null

    return PrismaProjectMapper.toEntity({
      ...data,
      trails: data.trails.map(t => ({ id: t.trailId })),
      professors: data.professors.map(p => ({ id: p.professorId })),
    })
  }

  async findManyByAuthorId(authorId: string): Promise<Project[]> {
    const data = await prisma.project.findMany({
      where: {
        authorId,
        status: 'DRAFT',
      },
      include: {
        trails: {
          select: {
            trailId: true,
          },
        },
        professors: {
          select: {
            professorId: true,
          },
        },
      },
    })

    return data.map(d =>
      PrismaProjectMapper.toEntity({
        ...d,
        trails: d.trails.map(t => ({ id: t.trailId })),
        professors: d.professors.map(p => ({ id: p.professorId })),
      }),
    )
  }

  async create(draft: Project): Promise<void> {
    const data = PrismaProjectMapper.toPrisma(draft)

    await prisma.project.create({
      data: {
        id: randomUUID(),
        title: data.title,
        description: data.description,
        content: data.content,
        semester: data.semester,
        publishedYear: data.publishedYear,
        status: 'DRAFT',
        allowComments: data.allowComments,
        bannerUrl: data.bannerUrl,
        authorId: data.authorId,
        subjectId: data.subjectId,
      },
    })

    // Create trail associations
    if (draft.trails.size > 0) {
      await prisma.projectTrail.createMany({
        data: Array.from(draft.trails).map(trailId => ({
          projectId: draft.id.toString(),
          trailId: trailId.toString(),
        })),
      })
    }

    // Create professor associations
    if (draft.professors.size > 0) {
      await prisma.projectProfessor.createMany({
        data: Array.from(draft.professors).map(professorId => ({
          projectId: draft.id.toString(),
          professorId: professorId.toString(),
        })),
      })
    }
  }

  async save(draft: Project): Promise<void> {
    await prisma.project.update({
      where: {
        id: draft.id.toString(),
      },
      data: {
        title: draft.title,
        description: draft.description,
        content: draft.content,
        semester: draft.semester,
        publishedYear: draft.publishedYear,
        allowComments: draft.allowComments,
        bannerUrl: draft.bannerUrl,
        subjectId: draft.subjectId?.toString(),
      },
    })

    // Update trail associations
    await prisma.projectTrail.deleteMany({
      where: { projectId: draft.id.toString() },
    })
    if (draft.trails.size > 0) {
      await prisma.projectTrail.createMany({
        data: Array.from(draft.trails).map(trailId => ({
          projectId: draft.id.toString(),
          trailId: trailId.toString(),
        })),
      })
    }

    // Update professor associations
    await prisma.projectProfessor.deleteMany({
      where: { projectId: draft.id.toString() },
    })
    if (draft.professors.size > 0) {
      await prisma.projectProfessor.createMany({
        data: Array.from(draft.professors).map(professorId => ({
          projectId: draft.id.toString(),
          professorId: professorId.toString(),
        })),
      })
    }
  }

  async delete(id: string): Promise<void> {
    await prisma.project.delete({
      where: {
        id,
      },
    })
  }
}
