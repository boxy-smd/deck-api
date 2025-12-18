import { ProjectDTO } from '@/@core/application/projects/dtos/project.dto'
import {
  ProjectQuery,
  ProjectsRepository,
} from '@/@core/application/projects/repositories/projects-repository'
import { Project } from '@/@core/domain/projects/entities/project'
import { Inject, Injectable } from '@nestjs/common'
import { and, desc, eq, ilike, inArray, or } from 'drizzle-orm'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { DRIZZLE } from '../drizzle.provider'
import { DrizzleProjectMapper } from '../mappers/drizzle-project-mapper'
import * as schema from '../schema'
import { projectProfessors, projectTrails, projects } from '../schema'

@Injectable()
export class DrizzleProjectsRepository implements ProjectsRepository {
  constructor(
    @Inject(DRIZZLE) private drizzle: NodePgDatabase<typeof schema>,
  ) {}

  async findById(id: string): Promise<Project | null> {
    const result = await this.drizzle.query.projects.findFirst({
      where: eq(projects.id, id),
      with: {
        author: true,
        subject: true,
        trails: { with: { trail: true } },
        professors: { with: { professor: true } },
      },
    })

    if (!result) return null

    return DrizzleProjectMapper.toEntity(result)
  }

  async findAll(): Promise<Project[]> {
    const results = await this.drizzle.query.projects.findMany({
      with: {
        author: true,
        subject: true,
        trails: { with: { trail: true } },
        professors: { with: { professor: true } },
      },
      orderBy: desc(projects.createdAt),
    })

    return results.map(DrizzleProjectMapper.toEntity)
  }

  async create(entity: Project): Promise<void> {
    await this.drizzle.transaction(async tx => {
      await tx.insert(projects).values({
        id: entity.id.toString(),
        title: entity.title,
        description: entity.description ?? null,
        content: entity.content ?? null,
        semester: entity.semester ?? null,
        publishedYear: entity.publishedYear ?? null,
        status: entity.status,
        allowComments: entity.allowComments,
        bannerUrl: entity.bannerUrl ?? null,
        authorId: entity.authorId.toString(),
        subjectId: entity.subjectId?.toString() ?? null,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt ?? null,
      })

      if (entity.trails.size > 0) {
        await tx.insert(projectTrails).values(
          Array.from(entity.trails).map(trailId => ({
            projectId: entity.id.toString(),
            trailId: trailId.toString(),
          })),
        )
      }

      if (entity.professors.size > 0) {
        await tx.insert(projectProfessors).values(
          Array.from(entity.professors).map(profId => ({
            projectId: entity.id.toString(),
            professorId: profId.toString(),
          })),
        )
      }
    })
  }

  async save(entity: Project): Promise<void> {
    await this.drizzle.transaction(async tx => {
      await tx
        .update(projects)
        .set({
          title: entity.title,
          description: entity.description,
          content: entity.content,
          semester: entity.semester,
          publishedYear: entity.publishedYear,
          status: entity.status,
          allowComments: entity.allowComments,
          bannerUrl: entity.bannerUrl,
          subjectId: entity.subjectId?.toString(),
          updatedAt: new Date(),
        })
        .where(eq(projects.id, entity.id.toString()))

      // Sync Trails (Delete all and re-insert is simplest, but maybe inefficient. Usually OK for junction tables)
      await tx
        .delete(projectTrails)
        .where(eq(projectTrails.projectId, entity.id.toString()))

      if (entity.trails.size > 0) {
        await tx.insert(projectTrails).values(
          Array.from(entity.trails).map(trailId => ({
            projectId: entity.id.toString(),
            trailId: trailId.toString(),
          })),
        )
      }

      // Sync Professors
      await tx
        .delete(projectProfessors)
        .where(eq(projectProfessors.projectId, entity.id.toString()))

      if (entity.professors.size > 0) {
        await tx.insert(projectProfessors).values(
          Array.from(entity.professors).map(profId => ({
            projectId: entity.id.toString(),
            professorId: profId.toString(),
          })),
        )
      }
    })
  }

  async delete(entity: Project): Promise<void> {
    await this.deleteById(entity.id.toString())
  }

  async deleteById(id: string): Promise<void> {
    await this.drizzle.delete(projects).where(eq(projects.id, id))
  }

  async existsById(id: string): Promise<boolean> {
    const result = await this.drizzle.query.projects.findFirst({
      where: eq(projects.id, id),
      columns: { id: true },
    })
    return !!result
  }

  async findByIdWithDetails(id: string): Promise<ProjectDTO | null> {
    const result = await this.drizzle.query.projects.findFirst({
      where: eq(projects.id, id),
      with: {
        author: true,
        subject: true,
        trails: { with: { trail: true } },
        professors: { with: { professor: true } },
      },
    })

    if (!result) return null

    return DrizzleProjectMapper.toDTO(result)
  }

  async findManyByTitle(title: string): Promise<Project[]> {
    const results = await this.drizzle.query.projects.findMany({
      where: and(
        eq(projects.status, 'PUBLISHED'),
        ilike(projects.title, `%${title}%`),
      ),
      with: {
        author: true,
        subject: true,
        trails: { with: { trail: true } },
        professors: { with: { professor: true } },
      },
      orderBy: desc(projects.createdAt),
    })

    return results.map(DrizzleProjectMapper.toEntity)
  }

  async findManyProjectDTOsByTitle(title: string): Promise<ProjectDTO[]> {
    const results = await this.drizzle.query.projects.findMany({
      where: and(
        eq(projects.status, 'PUBLISHED'),
        ilike(projects.title, `%${title}%`),
      ),
      with: {
        author: true,
        subject: true,
        trails: { with: { trail: true } },
        professors: { with: { professor: true } },
      },
      orderBy: desc(projects.createdAt),
    })

    return results.map(DrizzleProjectMapper.toDTO)
  }

  async findManyByProfessorName(name: string): Promise<Project[]> {
    // This requires joining/filtering by relation. Drizzle query builder can filter by ONE-to-many?
    // Actually, `query.findMany` filtering on relations is limited.
    // Better to use `findMany` on projects and verify relation existence OR select projects where exists...
    // Or use generic `db.select().from(projects).innerJoin(...)`
    // For simplicity and correctness with complex filters, `db.select` builder is preferred over `.query.` API for complex `where` on relations.
    // BUT `.query.` API is nicer for fetching nested data.
    // We can fetch IDs first then fetch details? Or use `where: (projects, { exists }) => ...` in Drizzle query? (Not fully supported yet in all versions).
    // I will use `db.select` to get IDs, then `query.findMany` to get full objects? Or Map manually.
    // Let's try `query.projects.findMany`.

    // Filter projects where ANY professor name matches.
    // prisma: professors: { some: { professor: { name: { contains: ... } } } }

    const results = await this.drizzle.query.projects.findMany({
      where: (projects, { eq, and }) => and(eq(projects.status, 'PUBLISHED')), // Filter logic below
      with: {
        author: true,
        subject: true,
        trails: { with: { trail: true } },
        professors: {
          with: { professor: true },
        },
      },
    })

    // Client-side filtering for simplicity if volume is low?
    // No, that's bad.
    // I'll implementation `findSame` pattern where I select matching IDs first.

    // Use raw SQL or `inArray` with subquery.
    const matchingIds = await this.drizzle
      .select({ id: projects.id })
      .from(projects)
      .innerJoin(
        projectProfessors,
        eq(projects.id, projectProfessors.projectId),
      )
      .innerJoin(
        schema.professors,
        eq(projectProfessors.professorId, schema.professors.id),
      )
      .where(
        and(
          eq(projects.status, 'PUBLISHED'),
          ilike(schema.professors.name, `%${name}%`),
        ),
      )

    if (matchingIds.length === 0) return []

    const finalResults = await this.drizzle.query.projects.findMany({
      where: inArray(
        projects.id,
        matchingIds.map(r => r.id),
      ),
      with: {
        author: true,
        subject: true,
        trails: { with: { trail: true } },
        professors: { with: { professor: true } },
      },
      orderBy: desc(projects.createdAt),
    })

    return finalResults.map(DrizzleProjectMapper.toEntity)
  }

  // Reuse logic for DTO
  async findManyProjectDTOsByProfessorName(
    name: string,
  ): Promise<ProjectDTO[]> {
    const matchingIds = await this.drizzle
      .select({ id: projects.id })
      .from(projects)
      .innerJoin(
        projectProfessors,
        eq(projects.id, projectProfessors.projectId),
      )
      .innerJoin(
        schema.professors,
        eq(projectProfessors.professorId, schema.professors.id),
      )
      .where(
        and(
          eq(projects.status, 'PUBLISHED'),
          ilike(schema.professors.name, `%${name}%`),
        ),
      )

    if (matchingIds.length === 0) return []

    const results = await this.drizzle.query.projects.findMany({
      where: inArray(
        projects.id,
        matchingIds.map(r => r.id),
      ),
      with: {
        author: true,
        subject: true,
        trails: { with: { trail: true } },
        professors: { with: { professor: true } },
      },
      orderBy: desc(projects.createdAt),
    })

    return results.map(DrizzleProjectMapper.toDTO)
  }

  async findManyByQuery(query: ProjectQuery): Promise<Project[]> {
    const filters = [eq(projects.status, 'PUBLISHED')]

    if (query.semester) {
      filters.push(eq(projects.semester, query.semester))
    }
    if (query.publishedYear) {
      filters.push(eq(projects.publishedYear, query.publishedYear))
    }
    if (query.subjectId) {
      filters.push(eq(projects.subjectId, query.subjectId))
    }

    // Trails filter (ManyToMany)
    let trailIdsMatch: string[] | null = null
    if (query.trailsIds && query.trailsIds.length > 0) {
      const rows = await this.drizzle
        .select({ id: projects.id })
        .from(projects)
        .innerJoin(projectTrails, eq(projects.id, projectTrails.projectId))
        .where(inArray(projectTrails.trailId, query.trailsIds))

      if (rows.length === 0) return []
      trailIdsMatch = rows.map(r => r.id)
      filters.push(inArray(projects.id, trailIdsMatch))
    }

    const results = await this.drizzle.query.projects.findMany({
      where: and(...filters),
      with: {
        author: true,
        subject: true,
        trails: { with: { trail: true } },
        professors: { with: { professor: true } },
      },
      orderBy: desc(projects.publishedYear), // Matches Prisma orderBy
    })

    return results.map(DrizzleProjectMapper.toEntity)
  }

  async findManyProjectDTOsByQuery(query: ProjectQuery): Promise<ProjectDTO[]> {
    const filters = [eq(projects.status, 'PUBLISHED')]

    if (query.semester) {
      filters.push(eq(projects.semester, query.semester))
    }
    if (query.publishedYear) {
      filters.push(eq(projects.publishedYear, query.publishedYear))
    }
    if (query.subjectId) {
      filters.push(eq(projects.subjectId, query.subjectId))
    }

    if (query.trailsIds && query.trailsIds.length > 0) {
      const rows = await this.drizzle
        .select({ id: projects.id })
        .from(projects)
        .innerJoin(projectTrails, eq(projects.id, projectTrails.projectId))
        .where(inArray(projectTrails.trailId, query.trailsIds))

      if (rows.length === 0) return []
      filters.push(
        inArray(
          projects.id,
          rows.map(r => r.id),
        ),
      )
    }

    const results = await this.drizzle.query.projects.findMany({
      where: and(...filters),
      with: {
        author: true,
        subject: true,
        trails: { with: { trail: true } },
        professors: { with: { professor: true } },
      },
      orderBy: desc(projects.publishedYear),
    })

    return results.map(DrizzleProjectMapper.toDTO)
  }

  async findManyByTag(tag: string): Promise<Project[]> {
    // Tag search is usually description/title/content generic search or specific tags table if it existed.
    // In Prisma impl, it likely searched across fields.
    // Assuming 'search' behavior:
    const search = `%${tag}%`
    const results = await this.drizzle.query.projects.findMany({
      where: and(
        eq(projects.status, 'PUBLISHED'),
        or(
          ilike(projects.title, search),
          ilike(projects.description, search), // If logic matches previous
        ),
      ),
      with: {
        author: true,
        subject: true,
        trails: { with: { trail: true } },
        professors: { with: { professor: true } },
      },
      orderBy: desc(projects.createdAt),
    })

    return results.map(DrizzleProjectMapper.toEntity)
  }

  async findManyProjectDTOsByTag(tag: string): Promise<ProjectDTO[]> {
    const search = `%${tag}%`
    const results = await this.drizzle.query.projects.findMany({
      where: and(
        eq(projects.status, 'PUBLISHED'),
        or(ilike(projects.title, search), ilike(projects.description, search)),
      ),
      with: {
        author: true,
        subject: true,
        trails: { with: { trail: true } },
        professors: { with: { professor: true } },
      },
      orderBy: desc(projects.createdAt),
    })
    return results.map(DrizzleProjectMapper.toDTO)
  }

  async findManyByStudentId(studentId: string): Promise<Project[]> {
    const results = await this.drizzle.query.projects.findMany({
      where: and(
        eq(projects.authorId, studentId),
        eq(projects.status, 'PUBLISHED'),
      ),
      with: {
        author: true,
        subject: true,
        trails: { with: { trail: true } },
        professors: { with: { professor: true } },
      },
      orderBy: desc(projects.createdAt),
    })
    return results.map(DrizzleProjectMapper.toEntity)
  }

  async findManyProjectDTOsByStudentId(
    studentId: string,
  ): Promise<ProjectDTO[]> {
    const results = await this.drizzle.query.projects.findMany({
      where: and(
        eq(projects.authorId, studentId),
        eq(projects.status, 'PUBLISHED'),
      ),
      with: {
        author: true,
        subject: true,
        trails: { with: { trail: true } },
        professors: { with: { professor: true } },
      },
      orderBy: desc(projects.createdAt),
    })
    return results.map(DrizzleProjectMapper.toDTO)
  }

  async findAllProjectDTOs(): Promise<ProjectDTO[]> {
    const results = await this.drizzle.query.projects.findMany({
      with: {
        author: true,
        subject: true,
        trails: { with: { trail: true } },
        professors: { with: { professor: true } },
      },
      orderBy: desc(projects.createdAt),
    })
    return results.map(DrizzleProjectMapper.toDTO)
  }

  async findDraftsByAuthorId(authorId: string): Promise<Project[]> {
    const results = await this.drizzle.query.projects.findMany({
      where: and(eq(projects.authorId, authorId), eq(projects.status, 'DRAFT')),
      with: {
        author: true,
        subject: true,
        trails: { with: { trail: true } },
        professors: { with: { professor: true } },
      },
      orderBy: desc(projects.createdAt),
    })

    return results.map(DrizzleProjectMapper.toEntity)
  }
}
