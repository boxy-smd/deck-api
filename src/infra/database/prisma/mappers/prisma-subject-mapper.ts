import type { Prisma, Subject as SubjectRaw } from '@prisma/client'

import { Subject } from '@/domain/projects/enterprise/entities/subject.ts'
import { SubjectType } from '@/domain/projects/enterprise/value-objects/subject-type.ts'
import { UniqueEntityID } from '@/shared/kernel/unique-entity-id.ts'

// biome-ignore lint/complexity/noStaticOnlyClass: This class is a mapper and should have only static methods
export class PrismaSubjectMapper {
  static toEntity(raw: SubjectRaw): Subject {
    return Subject.create(
      {
        name: raw.name,
        code: raw.code,
        semester: raw.semester,
        type: SubjectType[raw.type],
        workload: raw.workload,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(subject: Subject): Prisma.SubjectUncheckedCreateInput {
    return {
      id: subject.id.toString(),
      name: subject.name,
      code: subject.code,
      workload: subject.workload,
      semester: subject.semester,
      type: SubjectType[subject.type],
      createdAt: subject.createdAt,
      updatedAt: subject.updatedAt ?? undefined,
    }
  }
}
