import type { User } from '@/domain/authentication/enterprise/entities/user.ts'
import type { Project } from '@/domain/projects/enterprise/entities/project.ts'

interface StudentProfileWithDetailsProps {
  student: User
  trails: string[]
  posts: Project[]
}

export class StudentProfileWithDetails {
  private readonly _props: StudentProfileWithDetailsProps

  constructor(props: StudentProfileWithDetailsProps) {
    this._props = props
  }

  get student(): User {
    return this._props.student
  }

  get id(): string {
    return this._props.student.id.toString()
  }

  get name(): string {
    return this._props.student.name
  }

  get username(): string {
    return this._props.student.username.value
  }

  get email(): string {
    return this._props.student.email.value
  }

  get about(): string | undefined {
    return this._props.student.about
  }

  get profileUrl(): string | undefined {
    return this._props.student.profileUrl
  }

  get semester(): number {
    return this._props.student.profile?.semester.value || 1
  }

  get role(): string {
    return this._props.student.role
  }

  get status(): string {
    return this._props.student.status
  }

  get trails(): string[] {
    return this._props.trails
  }

  get posts(): Project[] {
    return this._props.posts
  }

  static create(props: StudentProfileWithDetailsProps): StudentProfileWithDetails {
    return new StudentProfileWithDetails(props)
  }
}
