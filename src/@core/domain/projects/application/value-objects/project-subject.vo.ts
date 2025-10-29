import { ValueObject } from '@/@shared/kernel/kernel/value-object'

interface ProjectSubjectProps {
  name: string
}

export class ProjectSubject extends ValueObject<ProjectSubjectProps> {
  get name(): string {
    return this.props.name
  }

  static create(props: ProjectSubjectProps): ProjectSubject {
    return new ProjectSubject(props)
  }

  toDTO() {
    return {
      name: this.name,
    }
  }
}
