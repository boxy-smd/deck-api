import { Entity } from '@/core/entities/entity.ts'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'

export interface ProjectTrailProps {
  projectId: UniqueEntityID
  trailId: UniqueEntityID
}

export class ProjectTrail extends Entity<ProjectTrailProps> {
  get projectId() {
    return this.props.projectId
  }

  get trailId() {
    return this.props.trailId
  }

  static create(props: ProjectTrailProps, id?: UniqueEntityID): ProjectTrail {
    return new ProjectTrail(props, id)
  }
}
