import { Entity } from '../core/interfaces/entity.ts'
import type { Replace } from '../core/logic/replace.ts'

export type ProjectStatusEnum = 'draft' | 'published'

export interface ProjectProps {
  title: string
  description: string
  bannerUrl: string
  content?: string
  publishedYear: number
  status: ProjectStatusEnum
  semester: number
  allowComments: boolean
  createdAt: Date
  updatedAt: Date
  authorId: string
  subjectId: string
  professorIds: string[]
}

export class Project extends Entity<ProjectProps> {
  get title(): string {
    return this.props.title
  }

  get description(): string {
    return this.props.description
  }

  get bannerUrl(): string {
    return this.props.bannerUrl
  }

  get content(): string | undefined {
    return this.props.content
  }

  set content(content: string) {
    this.props.content = content
  }

  get publishedYear(): number {
    return this.props.publishedYear
  }

  get status(): ProjectStatusEnum {
    return this.props.status
  }

  set status(status: ProjectStatusEnum) {
    this.props.status = status
  }

  get semester(): number {
    return this.props.semester
  }

  set semester(semester: number) {
    this.props.semester = semester
  }

  get allowComments(): boolean {
    return this.props.allowComments
  }

  set allowComments(allowComments: boolean) {
    this.props.allowComments = allowComments
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  get authorId(): string {
    return this.props.authorId
  }

  get subjectId(): string {
    return this.props.subjectId
  }

  get professorIds(): string[] {
    return this.props.professorIds
  }

  static create(
    props: Replace<
      ProjectProps,
      {
        createdAt?: Date
        updatedAt?: Date
      }
    >,
    id?: string,
  ): Project {
    return new Project(
      {
        ...props,
        createdAt: props.createdAt || new Date(),
        updatedAt: props.updatedAt || new Date(),
      },
      id,
    )
  }
}
