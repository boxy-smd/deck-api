import type { Prisma, Subject as SubjectRaw } from '@prisma/client'

import { Subject } from '@/@core/domain/projects/entities/subject'
import { SubjectType } from '@/@core/domain/projects/value-objects/subject-type'
import { UniqueEntityID } from '@/@shared/kernel/kernel/unique-entity-id'

export class PrismaSubjectMapper {
  static toEntity(raw: SubjectRaw): Subject {
    return Subject.reconstitute(
      {
        name: raw.name,
        code: raw.code,
        semester: raw.semester,
        type: SubjectType[raw.type],
        workload: raw.workload,
      },
      new UniqueEntityID(raw.id),
      raw.createdAt,
      raw.updatedAt,
    )
  }

  static toPrisma(subject: Subject): Prisma.SubjectUncheckedCreateInput {
    return {
      id: subject.id.toString(),
      name: subject.name,
      code: subject.code,
      workload: subject.workload,
      semester: subject.semester,
      type: subject.type as any,
      createdAt: subject.createdAt,
      updatedAt: subject.updatedAt ?? undefined,
    }
  }
}
