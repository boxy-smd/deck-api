import { Entity } from '@/core/entities/entity.ts'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import type { Optional } from '@/core/types/optional.ts'
import type { Project } from '@/domain/entities/project.entity.ts'
import type { Trail } from '@/domain/entities/trail.entity.ts'
import type { Encrypter } from '@/domain/students/application/use-cases/cryptography/encrypter.ts'
import type { Email } from './value-objects/email.ts'

export interface StudentProps {
  name: string
  username: string
  email: Email
  passwordHash: string
  about?: string
  profileUrl?: string
  semester: number
  createdAt: Date
  updatedAt?: Date
  trails: Trail[]
  projects?: Project[]
  comments?: Comment[]
}

export class Student extends Entity<StudentProps> {
  get name() {
    return this.props.name
  }

  get username() {
    return this.props.username
  }

  get email() {
    return this.props.email
  }

  get passwordHash() {
    return this.props.passwordHash
  }

  get about() {
    return this.props.about
  }

  get profileUrl() {
    return this.props.profileUrl
  }

  get semester() {
    return this.props.semester
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get trails() {
    return this.props.trails
  }

  get projects() {
    return this.props.projects
  }

  get comments() {
    return this.props.comments
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  set name(name: string) {
    this.props.name = name
    this.touch()
  }

  set username(username: string) {
    this.props.username = username
    this.touch()
  }

  set email(email: Email) {
    this.props.email = email
    this.touch()
  }

  set passwordHash(passwordHash: string) {
    this.props.passwordHash = passwordHash
    this.touch()
  }

  set about(about: string | undefined) {
    this.props.about = about
    this.touch()
  }

  set profileUrl(profileUrl: string | undefined) {
    this.props.profileUrl = profileUrl
    this.touch()
  }

  set semester(semester: number) {
    this.props.semester = semester
    this.touch()
  }

  set trails(trails: Trail[]) {
    this.props.trails = trails
    this.touch()
  }

  set projects(projects: Project[] | undefined) {
    this.props.projects = projects
    this.touch()
  }

  set comments(comments: Comment[] | undefined) {
    this.props.comments = comments
    this.touch()
  }

  static create(
    props: Optional<StudentProps, 'createdAt'>,
    id?: UniqueEntityID,
  ): Student {
    return new Student(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    )
  }

  static hashPassword(password: string, encrypter: Encrypter): Promise<string> {
    return encrypter.hash(password)
  }
}
