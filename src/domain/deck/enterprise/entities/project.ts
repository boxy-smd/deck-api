import { AggregateRoot } from '@/core/entities/aggregate-root.ts'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import type { Optional } from '@/core/types/optional.ts'
import type { Comment } from './comment.ts'
import type { Professor } from './professor.ts'
import type { Trail } from './trail.ts'

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
  updatedAt?: Date
  authorId: UniqueEntityID
  subjectId?: UniqueEntityID
  trails: Trail[]
  professors?: Professor[]
  comments?: Comment[]
}

export class Project extends AggregateRoot<ProjectProps> {
  get title() {
    return this.props.title
  }

  get description() {
    return this.props.description
  }

  get bannerUrl() {
    return this.props.bannerUrl
  }

  get content() {
    return this.props.content || ''
  }

  get publishedYear() {
    return this.props.publishedYear
  }

  get status() {
    return this.props.status
  }

  get semester() {
    return this.props.semester
  }

  get allowComments() {
    return this.props.allowComments
  }

  get createdAt() {
    return this.props.createdAt
  }

  set updatedAt(updatedAt: Date) {
    this.props.updatedAt = updatedAt
  }

  get authorId() {
    return this.props.authorId
  }

  get subjectId() {
    return this.props.subjectId
  }

  get trails() {
    return this.props.trails
  }

  get professors() {
    return this.props.professors
  }

  get comments() {
    return this.props.comments
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  set title(title: string) {
    this.props.title = title
    this.touch()
  }

  set description(description: string) {
    this.props.description = description
    this.touch()
  }

  set bannerUrl(bannerUrl: string) {
    this.props.bannerUrl = bannerUrl
    this.touch()
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  set publishedYear(publishedYear: number) {
    this.props.publishedYear = publishedYear
    this.touch()
  }

  set status(status: ProjectStatusEnum) {
    this.props.status = status
    this.touch()
  }

  set semester(semester: number) {
    this.props.semester = semester
    this.touch()
  }

  set allowComments(allowComments: boolean) {
    this.props.allowComments = allowComments
    this.touch()
  }

  set authorId(authorId: UniqueEntityID) {
    this.props.authorId = authorId
    this.touch()
  }

  set subjectId(subjectId: UniqueEntityID | undefined) {
    this.props.subjectId = subjectId
    this.touch()
  }

  set trails(trails: Trail[]) {
    this.props.trails = trails
    this.touch()
  }

  set professors(professors: Professor[] | undefined) {
    this.props.professors = professors
    this.touch()
  }

  set comments(comments: Comment[] | undefined) {
    this.props.comments = comments
    this.touch()
  }

  static create(
    props: Optional<ProjectProps, 'createdAt'>,
    id?: UniqueEntityID,
  ): Project {
    return new Project(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    )
  }
}
