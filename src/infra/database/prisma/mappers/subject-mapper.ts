import type { Prisma, Subject as RawSubject } from '@prisma/client'

import type { Project } from '@/domain/entities/project.entity.ts'
import { Subject } from '@/domain/entities/subject.entity.ts'

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class SubjectMapper {
  static toDomain(raw: RawSubject, projects?: Project[]): Subject {
    const subject = Subject.create(
      {
        name: raw.name,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        projects,
      },
      raw.id,
    )

    return subject
  }

  static toPersistence(subject: Subject): Prisma.SubjectCreateInput {
    return {
      id: subject.id,
      name: subject.name,
      createdAt: subject.createdAt,
      updatedAt: subject.updatedAt,
      projects: {
        connect: subject.projects.map(project => ({ id: project.id })),
      },
    }
  }

  static toPersistenceUpdate(subject: Subject): Prisma.SubjectUpdateInput {
    const raw: Prisma.SubjectUpdateInput = {
      name: subject.name,
      updatedAt: new Date(),
    }

    return raw
  }
}
