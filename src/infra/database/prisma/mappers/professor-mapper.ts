import type { Prisma, Professor as RawProfessor } from '@prisma/client'

import type { UpdateProfessorRequest } from '@/domain/deck/application/repositories/professors-repository.ts'
import { Professor } from '@/domain/deck/enterprise/entities/professor.ts'
import type { Project } from '@/domain/deck/enterprise/entities/project.ts'

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class ProfessorMapper {
  static toDomain(raw: RawProfessor, projects?: Project[]): Professor {
    const professor = Professor.create(
      {
        name: raw.name,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        projects,
      },
      raw.id,
    )

    return professor
  }

  static toPersistence(professor: Professor): Prisma.ProfessorCreateInput {
    return {
      id: professor.id,
      name: professor.name,
      createdAt: professor.createdAt,
      updatedAt: professor.updatedAt,
      projects: {
        connect: professor.projects.map(project => ({ id: project.id })),
      },
    }
  }

  static toPersistenceUpdate(
    professor: UpdateProfessorRequest,
  ): Prisma.ProfessorUpdateInput {
    const raw: Prisma.ProfessorUpdateInput = {
      name: professor.name,
      updatedAt: new Date(),
    }

    return raw
  }
}
