import { AggregateRoot } from '@/shared/kernel/aggregate-root.ts'
import type { UniqueEntityID } from '@/shared/kernel/unique-entity-id.ts'
import type { Email } from '../value-objects/email.ts'
import { Semester } from '../value-objects/semester.ts'
import type { UserRole } from '../value-objects/user-role.ts'
import { UserStatus } from '../value-objects/user-status.ts'
import type { Username } from '../value-objects/username.ts'
import { StudentProfile } from './student-profile.ts'

export interface UserProps {
  name: string
  username: Username
  email: Email
  passwordHash: string
  about?: string
  profileUrl?: string
  role: UserRole
  status: UserStatus

  profile?: StudentProfile
}

export class User extends AggregateRoot<UserProps> {
  // --- 1. Factory methods ---
  static create(props: UserProps, id?: UniqueEntityID<User>): User {
    return new User(props, id)
  }

  static reconstitute(
    props: UserProps,
    id: UniqueEntityID,
    createdAt: Date,
    updatedAt: Date,
  ): User {
    return new User(props, id, createdAt, updatedAt)
  }

  // --- 2. Public methods ---
  public updateAbout(about: string | undefined): void {
    // TODO: Define a value object for about
    this.props.about = about
    this.touch()
  }

  public changeProfilePicture(profileUrl: string | undefined): void {
    this.props.profileUrl = profileUrl
    this.touch()
  }

  public isActive(): boolean {
    return this.props.status === UserStatus.ACTIVE
  }

  public activate(): void {
    this.props.status = UserStatus.ACTIVE
    this.touch()
  }

  public isInactive(): boolean {
    return this.props.status === UserStatus.INACTIVE
  }

  public inactivate(): void {
    this.props.status = UserStatus.INACTIVE
    this.touch()
  }

  public isBanned(): boolean {
    return this.props.status === UserStatus.BANNED
  }

  public ban() {
    this.props.status = UserStatus.BANNED
    this.touch()
  }

  public unban() {
    this.props.status = UserStatus.ACTIVE
    this.touch()
  }

  public changeRole(role: UserRole) {
    this.props.role = role
    this.touch()
  }

  public createProfile(semester: number) {
    if (this.props.profile) {
      throw new Error('O usuário já possui um perfil de estudante.')
    }

    const validatedSemester = Semester.create(semester)

    if (validatedSemester.isLeft()) {
      throw validatedSemester.value
    }

    const studentProfile = StudentProfile.create(
      {
        semester: validatedSemester.value,
      },
      this.id,
    )

    this.props.profile = studentProfile
    this.touch()
  }

  public addTrailToProfile(trailId: UniqueEntityID) {
    if (!this.props.profile) {
      throw new Error('O usuário não possui um perfil de estudante.')
    }

    this.props.profile.addTrail(trailId)
    this.touch()
  }

  public removeTrailFromProfile(trailId: UniqueEntityID) {
    if (!this.props.profile) {
      throw new Error('O usuário não possui um perfil de estudante.')
    }

    this.props.profile.removeTrail(trailId)
    this.touch()
  }

  // --- 3. Getters ---
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

  get role() {
    return this.props.role
  }

  get status() {
    return this.props.status
  }

  get profile() {
    return this.props.profile
  }
}
