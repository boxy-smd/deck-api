import { Entity } from '../core/interfaces/entity.ts'
import type { Comment } from './comment.entity.ts'
import type { Professor } from './professor.entity.ts'
import type { Trail } from './trail.entity.ts'

export type ProjectStatusEnum = 'DRAFT' | 'PUBLISHED'

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
  subjectId?: string
  trails: Trail[]
  professors?: Professor[]
  comments?: Comment[]
}

export class Project extends Entity<ProjectProps> {
  get title(): string {
    return this.props.title
  }

  set title(title: string) {
    this.props.title = title
  }

  get description(): string {
    return this.props.description
  }

  set description(description: string) {
    this.props.description = description
  }

  get bannerUrl(): string {
    return this.props.bannerUrl
  }

  set bannerUrl(bannerUrl: string) {
    this.props.bannerUrl = bannerUrl
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

  set publishedYear(publishedYear: number) {
    this.props.publishedYear = publishedYear
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

  set updatedAt(updatedAt: Date) {
    this.props.updatedAt = updatedAt
  }

  get authorId(): string {
    return this.props.authorId
  }

  set authorId(authorId: string) {
    this.props.authorId = authorId
  }

  get subjectId(): string | undefined {
    return this.props.subjectId
  }

  set subjectId(subjectId: string) {
    this.props.subjectId = subjectId
  }

  get trails(): Trail[] {
    return this.props.trails
  }

  set trails(trails: Trail[]) {
    this.props.trails = trails
  }

  get professors(): Professor[] | undefined {
    return this.props.professors
  }

  set professors(professors: Professor[]) {
    this.props.professors = professors
  }

  get comments(): Comment[] | undefined {
    return this.props.comments
  }

  set comments(comments: Comment[]) {
    this.props.comments = comments
  }

  static create(
    { createdAt = new Date(), updatedAt = new Date(), ...props }: ProjectProps,
    id?: string,
  ): Project {
    return new Project(
      {
        ...props,
        createdAt,
        updatedAt,
      },
      id,
    )
  }
}
