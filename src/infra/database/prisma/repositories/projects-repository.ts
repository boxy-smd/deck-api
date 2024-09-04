import type {
  ProjectQuery,
  ProjectsRepository,
} from '@/domain/deck/application/repositories/projects-repository.ts'
import type { Project } from '@/domain/deck/enterprise/entities/project.ts'
import { prisma } from '../client.ts'
import { ProjectMapper } from '../mappers/projects-mapper.ts'
import { TrailMapper } from '../mappers/trail-mapper.ts'

export class PrismaProjectsRepository implements ProjectsRepository {
  async create(project: Project): Promise<Project> {
    const raw = ProjectMapper.toPersistence(project)
    const createdRaw = await prisma.project.create({ data: raw })
    return ProjectMapper.toDomain(createdRaw, project.trails)
  }

  async findById(id: string): Promise<Project | null> {
    const raw = await prisma.project.findUnique({
      where: { id },
      include: {
        trails: true,
        comments: true,
        professors: true,
      },
    })

    if (!raw) return null

    const trais = raw.trails.map(trail => TrailMapper.toDomain(trail))

    return ProjectMapper.toDomain(raw, trais)
  }

  async fetchByQuery({
    authorId,
    professorsIds,
    publishedYear,
    subjectId,
    title,
  }: ProjectQuery): Promise<Project[]> {
    const raw = await prisma.project.findMany({
      where: {
        authorId,
        professors: {
          some: { id: { in: professorsIds } },
        },
        publishedYear,
        subjectId,
        title: { contains: title },
      },
      include: {
        trails: true,
        comments: true,
        professors: true,
      },
    })

    return raw.map(project => {
      const trais = project.trails.map(trail => TrailMapper.toDomain(trail))
      return ProjectMapper.toDomain(project, trais)
    })
  }

  async update(id: string, project: Project): Promise<Project> {
    const raw = ProjectMapper.toPersistence(project)
    const updatedRaw = await prisma.project.update({
      where: { id },
      data: raw,
    })
    return ProjectMapper.toDomain(updatedRaw, project.trails)
  }

  async delete(id: string): Promise<void> {
    await prisma.project.delete({ where: { id } })
  }
}
