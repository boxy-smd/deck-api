import { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import { ProjectTrailList } from '@/domain/deck/enterprise/entities/project-trail-list.ts'
import {
  Project,
  type ProjectProps,
} from '@/domain/deck/enterprise/entities/project.ts'
import { makeProjectTrail } from './make-project-trails.ts'
import { makeTrail } from './make-trail.ts'

export function makeProject(
  override: Partial<ProjectProps> = {},
  id?: UniqueEntityID,
) {
  const project = Project.create(
    {
      title: 'Project Title',
      description: 'Project Description',
      bannerUrl: 'https://banner-url.com',
      publishedYear: 2021,
      status: 'DRAFT',
      semester: 1,
      allowComments: true,
      authorId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  const trail = makeTrail()

  const projectTrail = makeProjectTrail({
    projectId: project.id,
    trailId: trail.id,
  })

  project.trails = new ProjectTrailList([projectTrail])

  return project
}
