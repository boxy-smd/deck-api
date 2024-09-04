import { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import {
  ProjectProfessor,
  type ProjectProfessorProps,
} from '@/domain/deck/enterprise/entities/project-professor.ts'

export function makeProjectProfessor(
  override: Partial<ProjectProfessorProps> = {},
  id?: UniqueEntityID,
) {
  const projectProfessor = ProjectProfessor.create(
    {
      projectId: new UniqueEntityID(),
      professorId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return projectProfessor
}
