import type { User } from '@/@core/domain/authentication/enterprise/entities/user'
import type { Project } from '@/@core/domain/projects/enterprise/entities/project'
import { ValueObject } from '@/@shared/kernel/kernel/value-object'

interface StudentProfileWithDetailsProps {
  student: User
  trails: string[]
  posts: Project[]
}

export class StudentProfileWithDetails extends ValueObject<StudentProfileWithDetailsProps> {
  get student(): User {
    return this.props.student
  }

  get id(): string {
    return this.props.student.id.toString()
  }

  get name(): string {
    return this.props.student.name
  }

  get username(): string {
    return this.props.student.username.value
  }

  get email(): string {
    return this.props.student.email.value
  }

  get about(): string | undefined {
    return this.props.student.about
  }

  get profileUrl(): string | undefined {
    return this.props.student.profileUrl
  }

  get semester(): number {
    return this.props.student.profile?.semester.value || 1
  }

  get role(): string {
    return this.props.student.role
  }

  get status(): string {
    return this.props.student.status
  }

  get trails(): string[] {
    return this.props.trails
  }

  get posts(): Project[] {
    return this.props.posts
  }

  static create(
    props: StudentProfileWithDetailsProps,
  ): StudentProfileWithDetails {
    return new StudentProfileWithDetails(props)
  }

  toDTO() {
    return {
      id: this.id,
      name: this.name,
      username: this.username,
      email: this.email,
      about: this.about,
      profileUrl: this.profileUrl,
      semester: this.semester,
      role: this.role,
      status: this.status,
      trails: this.trails,
      posts: this.posts.map(post => ({
        id: post.id.toString(),
        title: post.title,
        description: post.description,
        bannerUrl: post.bannerUrl,
        status: post.status,
        createdAt: post.createdAt,
      })),
    }
  }
}
