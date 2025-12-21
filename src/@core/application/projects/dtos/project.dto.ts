import type { Professor } from '@/@core/domain/projects/entities/professor'
import type { Project } from '@/@core/domain/projects/entities/project'
import type { Subject } from '@/@core/domain/projects/entities/subject'
import type { Trail } from '@/@core/domain/projects/entities/trail'
import type { ProjectStatus } from '@/@core/domain/projects/value-objects/project-status'
import type { User } from '@/@core/domain/users/entities/user'
import type { CommentWithAuthor } from '../../../domain/interactions/value-objects/comment-with-author'

export interface ProjectAuthorDTO {
  id: string
  name: string
  username: string
  profileUrl: string | null
}

export interface ProjectSubjectDTO {
  id: string
  name: string
}

export interface ProjectTrailDTO {
  id: string
  name: string
}

export interface ProjectProfessorDTO {
  id: string
  name: string
}

export interface ProjectDTO {
  id: string
  title: string
  description: string
  bannerUrl: string | null
  content: string | null
  publishedYear: number | null
  allowComments: boolean
  status: ProjectStatus
  semester: number | null
  createdAt: Date
  updatedAt: Date | null
  authorId: string
  author: ProjectAuthorDTO
  subjectId: string | null
  subject: ProjectSubjectDTO | null
  trails: ProjectTrailDTO[]
  professors: ProjectProfessorDTO[]
  comments: CommentWithAuthor[]
}

export class ProjectDTOMapper {
  static toDTO(
    project: Project,
    author: User,
    trails: Trail[],
    subject: Subject | null,
    professors: Professor[],
  ): ProjectDTO {
    return {
      id: project.id.toString(),
      title: project.title,
      description: project.description,
      bannerUrl: project.bannerUrl,
      allowComments: project.allowComments,
      content: project.content,
      publishedYear: project.publishedYear,
      status: project.status,
      semester: project.semester,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      authorId: author.id.toString(),
      author: {
        id: author.id.toString(),
        name: author.name,
        username: author.username.value,
        profileUrl: author.profileUrl,
      },
      subjectId: subject ? subject.id.toString() : null,
      subject: subject
        ? {
            id: subject.id.toString(),
            name: subject.name,
          }
        : null,
      trails: trails.map(trail => ({
        id: trail.id.toString(),
        name: trail.name,
      })),
      professors: professors.map(professor => ({
        id: professor.id.toString(),
        name: professor.name,
      })),
      comments: [],
    }
  }
}
