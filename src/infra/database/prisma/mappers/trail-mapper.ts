import type { Prisma, Trail as RawTrail } from '@prisma/client'

import type { UpdateTrailRequest } from '@/domain/deck/application/repositories/trails-repository.ts'
import type { Project } from '@/domain/deck/enterprise/entities/project.entity.ts'
import { Trail } from '@/domain/deck/enterprise/entities/trail.ts'
import type { User } from '@/domain/entities/user.entity.ts'

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class TrailMapper {
  static toDomain(raw: RawTrail, projects?: Project[], users?: User[]): Trail {
    const trail = Trail.create(
      {
        name: raw.name,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        projects,
        users,
      },
      raw.id,
    )

    return trail
  }

  static toPersistence(trail: Trail): Prisma.TrailCreateInput {
    return {
      id: trail.id,
      name: trail.name,
      createdAt: trail.createdAt,
      updatedAt: trail.updatedAt,
      projects: {
        connect: trail.projects.map(project => ({ id: project.id })),
      },
      users: {
        connect: trail.users.map(user => ({ id: user.id })),
      },
    }
  }

  static toPersistenceUpdate(
    trail: UpdateTrailRequest,
  ): Prisma.TrailUpdateInput {
    const raw: Prisma.TrailUpdateInput = {
      name: trail.name,
      updatedAt: new Date(),
    }

    return raw
  }
}
