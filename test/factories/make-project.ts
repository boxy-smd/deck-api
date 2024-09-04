import { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import {
  Project,
  type ProjectProps,
} from '@/domain/deck/enterprise/entities/project.ts'

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
      trails: [],
      ...override,
    },
    id,
  )

  return project
}
