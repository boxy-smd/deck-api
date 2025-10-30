import { ValueObject } from '@/@shared/kernel/kernel/value-object'

interface ProjectSubjectProps {
  id: string
  name: string
}

export class ProjectSubject extends ValueObject<ProjectSubjectProps> {
  get id(): string {
    return this.props.id
  }

  get name(): string {
    return this.props.name
  }

  static create(props: ProjectSubjectProps): ProjectSubject {
    return new ProjectSubject(props)
  }

  toDTO() {
    return {
      id: this.id,
      name: this.name,
    }
  }
}
