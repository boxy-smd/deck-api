import { ProjectSummaryDTO } from '@/@core/application/projects/dtos/project-summary.dto'
import { ProjectDTO } from '@/@core/application/projects/dtos/project.dto'
import { Project } from '@/@core/domain/projects/entities/project'
import { ProjectStatus } from '@/@core/domain/projects/value-objects/project-status'
import { UniqueEntityID } from '@/@shared/kernel/kernel/unique-entity-id'
import { InferSelectModel } from 'drizzle-orm'
import { professors, projects, subjects, trails, users } from '../schema'

type ProjectRaw = InferSelectModel<typeof projects>
type UserRaw = InferSelectModel<typeof users>
type SubjectRaw = InferSelectModel<typeof subjects>
type TrailRaw = InferSelectModel<typeof trails>
type ProfessorRaw = InferSelectModel<typeof professors>

export type DrizzleProjectWithDetails = ProjectRaw & {
  author: UserRaw
  subject: SubjectRaw | null
  trails: { trail: TrailRaw }[]
  professors: { professor: ProfessorRaw }[]
}

export class DrizzleProjectMapper {
  static toEntity(raw: DrizzleProjectWithDetails): Project {
    return Project.create(
      {
        title: raw.title,
        description: raw.description ?? '',
        content: raw.content ?? undefined,
        semester: raw.semester ?? 0,
        publishedYear: raw.publishedYear ?? 0,
        status: raw.status as ProjectStatus,
        allowComments: raw.allowComments,
        bannerUrl: raw.bannerUrl ?? undefined,
        authorId: UniqueEntityID.create(raw.authorId),
        subjectId: raw.subjectId
          ? UniqueEntityID.create(raw.subjectId)
          : undefined,
        trails: new Set(raw.trails.map(t => UniqueEntityID.create(t.trail.id))),
        professors: new Set(
          raw.professors.map(p => UniqueEntityID.create(p.professor.id)),
        ),
      },
      UniqueEntityID.create(raw.id),
    )
  }

  static toDTO(raw: DrizzleProjectWithDetails): ProjectDTO {
    return {
      id: raw.id,
      title: raw.title,
      description: raw.description ?? '',
      bannerUrl: raw.bannerUrl,
      content: raw.content,
      publishedYear: raw.publishedYear ?? 0,
      allowComments: raw.allowComments,
      status: raw.status as ProjectStatus,
      semester: raw.semester ?? 0,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      authorId: raw.authorId,
      author: {
        id: raw.author.id,
        name: raw.author.name,
        username: raw.author.username,
        profileUrl: raw.author.profileUrl,
      },
      subjectId: raw.subjectId,
      subject: raw.subject
        ? { id: raw.subject.id, name: raw.subject.name }
        : null,
      trails: raw.trails.map(t => ({
        id: t.trail.id,
        name: t.trail.name,
      })),
      professors: raw.professors.map(p => ({
        id: p.professor.id,
        name: p.professor.name,
      })),
    }
  }

  static toSummaryDTO(raw: DrizzleProjectWithDetails): ProjectSummaryDTO {
    return {
      id: raw.id,
      title: raw.title,
      description: raw.description ?? '',
      bannerUrl: raw.bannerUrl,
      publishedYear: raw.publishedYear ?? 0,
      semester: raw.semester ?? 0,
      allowComments: raw.allowComments,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      author: {
        id: raw.author.id,
        name: raw.author.name,
        username: raw.author.username,
        profileUrl: raw.author.profileUrl,
      },
      subject: raw.subject
        ? { id: raw.subject.id, name: raw.subject.name }
        : null,
      trails: raw.trails.map(t => ({
        id: t.trail.id,
        name: t.trail.name,
      })),
      professors: raw.professors.map(p => ({
        id: p.professor.id,
        name: p.professor.name,
      })),
    }
  }
}
