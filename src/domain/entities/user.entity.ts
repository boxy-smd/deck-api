import type { Encrypter } from '@/application/use-cases/users/cryptography/encrypter.ts'
import { Entity } from '../core/interfaces/entity.ts'
import { type Either, left, right } from '../core/logic/either.ts'
import type { Replace } from '../core/logic/replace.ts'
import { Email } from '../value-objects/email.ts'
import { EmailBadFormattedError } from '../value-objects/errors/email-bad-formatted.error.ts'
import type { Comment } from './comment.entity.ts'
import type { Project } from './project.entity.ts'
import type { Trail } from './trail.entity.ts'

export interface UserProps {
  name: string
  username: string
  email: Email
  passwordHash: string
  about?: string
  profileUrl?: string
  semester: number
  createdAt: Date
  updatedAt: Date
  trails?: Trail[]
  projects?: Project[]
  comments?: Comment[]
}

export class User extends Entity<UserProps> {
  get name(): string {
    return this.props.name
  }

  get username(): string {
    return this.props.username
  }

  get email(): Email {
    return this.props.email
  }

  get passwordHash(): string {
    return this.props.passwordHash
  }

  get about(): string | undefined {
    return this.props.about
  }

  set about(about: string) {
    this.props.about = about
  }

  get profileUrl(): string | undefined {
    return this.props.profileUrl
  }

  set profileUrl(url: string) {
    this.props.profileUrl = url
  }

  get semester(): number {
    return this.props.semester
  }

  set semester(semester: number) {
    this.props.semester = semester
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  set updatedAt(date: Date) {
    this.props.updatedAt = date
  }

  get trails(): Trail[] {
    return this.props.trails || []
  }

  set trails(trails: Trail[]) {
    this.props.trails = trails
  }

  get projects(): Project[] {
    return this.props.projects || []
  }

  set projects(projects: Project[]) {
    this.props.projects = projects
  }

  get comments(): Comment[] {
    return this.props.comments || []
  }

  set comments(comments: Comment[]) {
    this.props.comments = comments
  }

  static create(
    props: Replace<
      UserProps,
      {
        email: string
      }
    >,
    id?: string,
  ): Either<EmailBadFormattedError, User> {
    const emailOrError = Email.create(props.email)

    if (emailOrError.isLeft()) {
      return left(new EmailBadFormattedError(emailOrError.value.message))
    }

    const validatedEmail = emailOrError.value

    const user = new User(
      {
        ...props,
        email: validatedEmail,
      },
      id,
    )

    return right(user)
  }

  static hashPassword(password: string, encrypter: Encrypter): Promise<string> {
    return encrypter.hash(password)
  }
}
