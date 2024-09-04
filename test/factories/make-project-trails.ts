import { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import {
  ProjectTrail,
  type ProjectTrailProps,
} from '@/domain/deck/enterprise/entities/project-trail.ts'

export function makeProjectTrail(
  override: Partial<ProjectTrailProps> = {},
  id?: UniqueEntityID,
) {
  const projectTrail = ProjectTrail.create(
    {
      projectId: new UniqueEntityID(),
      trailId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return projectTrail
}
