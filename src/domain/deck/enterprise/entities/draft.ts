import { AggregateRoot } from '@/core/entities/aggregate-root.ts'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import type { Optional } from '@/core/types/optional.ts'
import type { Professor } from './professor.ts'
import type { Trail } from './trail.ts'

export interface DraftProps {
  title: string
  description?: string
  bannerUrl?: string
  content?: string
  publishedYear?: number | undefined
  semester?: number | undefined
  allowComments?: boolean | undefined
  createdAt: Date
  updatedAt?: Date
  authorId: UniqueEntityID
  subjectId?: UniqueEntityID
  trails?: Trail[]
  professors?: Professor[]
}

export class Draft extends AggregateRoot<DraftProps> {
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
    return this.props.content
  }

  get publishedYear() {
    return this.props.publishedYear
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

  private touch() {
    this.props.updatedAt = new Date()
  }

  set title(title: string) {
    this.props.title = title
    this.touch()
  }

  set description(description: string | undefined) {
    this.props.description = description
    this.touch()
  }

  set bannerUrl(bannerUrl: string | undefined) {
    this.props.bannerUrl = bannerUrl
    this.touch()
  }

  set content(content: string | undefined) {
    this.props.content = content
    this.touch()
  }

  set publishedYear(publishedYear: number | undefined) {
    this.props.publishedYear = publishedYear
    this.touch()
  }

  set semester(semester: number | undefined) {
    this.props.semester = semester
    this.touch()
  }

  set allowComments(allowComments: boolean | undefined) {
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

  set trails(trails: Trail[] | undefined) {
    this.props.trails = trails
    this.touch()
  }

  set professors(professors: Professor[] | undefined) {
    this.props.professors = professors
    this.touch()
  }

  static create(
    props: Optional<DraftProps, 'createdAt'>,
    id?: UniqueEntityID,
  ): Draft {
    return new Draft(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
  }
}
