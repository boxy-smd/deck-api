import type { Prisma, Subject as SubjectRaw } from '@prisma/client'

import { Subject } from '@/@core/domain/projects/enterprise/entities/subject'
import { SubjectType } from '@/@core/domain/projects/enterprise/value-objects/subject-type'
import { UniqueEntityID } from '@/@shared/kernel/kernel/unique-entity-id'

// biome-ignore lint/complexity/noStaticOnlyClass: This class is a mapper and should have only static methods
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
      type: SubjectType[subject.type],
      createdAt: subject.createdAt,
      updatedAt: subject.updatedAt ?? undefined,
    }
  }
}
