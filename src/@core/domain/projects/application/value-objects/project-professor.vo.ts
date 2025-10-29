import { ValueObject } from '@/@shared/kernel/kernel/value-object'

interface ProjectProfessorProps {
  name: string
}

export class ProjectProfessor extends ValueObject<ProjectProfessorProps> {
  get name(): string {
    return this.props.name
  }

  static create(props: ProjectProfessorProps): ProjectProfessor {
    return new ProjectProfessor(props)
  }

  toDTO() {
    return {
      name: this.name,
    }
  }
}
