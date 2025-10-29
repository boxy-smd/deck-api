import { ValueObject } from '@/@shared/kernel/kernel/value-object'

interface ProjectAuthorProps {
  name: string
  username: string
  profileUrl: string | null
}

export class ProjectAuthor extends ValueObject<ProjectAuthorProps> {
  get name(): string {
    return this.props.name
  }

  get username(): string {
    return this.props.username
  }

  get profileUrl(): string | null {
    return this.props.profileUrl
  }

  static create(props: ProjectAuthorProps): ProjectAuthor {
    return new ProjectAuthor(props)
  }

  toDTO() {
    return {
      name: this.name,
      username: this.username,
      profileUrl: this.profileUrl,
    }
  }
}
