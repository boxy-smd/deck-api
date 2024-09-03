import type { Prisma, Subject as RawSubject } from '@prisma/client'

import type { UpdateSubjectRequest } from '@/domain/deck/application/repositories/subjects-repository.ts'
import type { Project } from '@/domain/deck/enterprise/entities/project.entity.ts'
import { Subject } from '@/domain/deck/enterprise/entities/subject.entity.ts'

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

  static toPersistenceUpdate(
    subject: UpdateSubjectRequest,
  ): Prisma.SubjectUpdateInput {
    const raw: Prisma.SubjectUpdateInput = {
      name: subject.name,
      updatedAt: new Date(),
    }

    return raw
  }
}
