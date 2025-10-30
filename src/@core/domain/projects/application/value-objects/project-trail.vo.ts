import { ValueObject } from '@/@shared/kernel/kernel/value-object'

interface ProjectTrailProps {
  id: string
  name: string
}

export class ProjectTrail extends ValueObject<ProjectTrailProps> {
  get id(): string {
    return this.props.id
  }

  get name(): string {
    return this.props.name
  }

  static create(props: ProjectTrailProps): ProjectTrail {
    return new ProjectTrail(props)
  }

  toDTO() {
    return {
      id: this.id,
      name: this.name,
    }
  }
}
