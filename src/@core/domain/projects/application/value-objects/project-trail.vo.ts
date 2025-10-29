import { ValueObject } from '@/@shared/kernel/kernel/value-object'

interface ProjectTrailProps {
  name: string
}

export class ProjectTrail extends ValueObject<ProjectTrailProps> {
  get name(): string {
    return this.props.name
  }

  static create(props: ProjectTrailProps): ProjectTrail {
    return new ProjectTrail(props)
  }

  toDTO() {
    return {
      name: this.name,
    }
  }
}
