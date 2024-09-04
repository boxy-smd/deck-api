import type { Prisma, Project as RawProject } from '@prisma/client'

import type { UpdateProjectRequest } from '@/domain/deck/application/repositories/projects-repository.ts'
import type { Comment } from '@/domain/deck/enterprise/entities/comment.ts'
import type { Professor } from '@/domain/deck/enterprise/entities/professor.ts'
import { Project } from '@/domain/deck/enterprise/entities/project.ts'
import type { Trail } from '@/domain/deck/enterprise/entities/trail.ts'

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class ProjectMapper {
  static toDomain(
    raw: RawProject,
    trails: Trail[],
    comments?: Comment[],
    professors?: Professor[],
  ): Project {
    const project = Project.create(
      {
        title: raw.title,
        bannerUrl: raw.bannerUrl,
        description: raw.description,
        allowComments: raw.allowComments,
        publishedYear: raw.publishedYear,
        content: raw.content || undefined,
        semester: raw.semester,
        status: raw.status,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        authorId: raw.authorId,
        subjectId: raw.subjectId,
        trails: trails,
        comments: comments,
        professors: professors,
      },
      raw.id,
    )

    return project
  }

  static toPersistence(project: Project): Prisma.ProjectCreateInput {
    return {
      id: project.id,
      title: project.title,
      bannerUrl: project.bannerUrl,
      description: project.description,
      allowComments: project.allowComments,
      publishedYear: project.publishedYear,
      content: project.content || undefined,
      semester: project.semester,
      status: project.status,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      author: {
        connect: { id: project.authorId },
      },
      subject: {
        connect: { id: project.subjectId },
      },
      trails: {
        connect: project.trails.map(trail => ({ id: trail.id })),
      },
      comments: project.comments && {
        connect: project.comments.map(comment => ({ id: comment.id })),
      },
      professors: project.professors && {
        connect: project.professors.map(professor => ({ id: professor.id })),
      },
    }
  }

  static toPersistenceUpdate(
    project: UpdateProjectRequest,
  ): Prisma.ProjectUpdateInput {
    const raw: Prisma.ProjectUpdateInput = {
      title: project.title,
      bannerUrl: project.bannerUrl,
      description: project.description,
      allowComments: project.allowComments,
      publishedYear: project.publishedYear,
      content: project.content,
      semester: project.semester,
      status: project.status,
      updatedAt: new Date(),
    }

    return raw
  }
}
