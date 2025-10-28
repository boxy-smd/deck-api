import {
  Project,
  type ProjectProps,
} from '@/domain/projects/enterprise/entities/project.ts'
import { ProjectStatus } from '@/domain/projects/enterprise/value-objects/project-status.ts'
import { UniqueEntityID } from '@/shared/kernel/unique-entity-id.ts'

export function makeProject(
  override: Partial<ProjectProps> = {},
  id?: UniqueEntityID,
) {
  const project = Project.create(
    {
      title: 'Título do Projeto',
      description: 'Descrição do projeto',
      bannerUrl: 'https://banner-url.com',
      publishedYear: 2021,
      status: ProjectStatus.DRAFT,
      semester: 1,
      allowComments: true,
      authorId: new UniqueEntityID(),
      trails: new Set(),
      ...override,
    },
    id,
  )

  return project
}
