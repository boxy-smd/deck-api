import type { Prisma, Subject as SubjectRaw } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import { SubjectType } from '@/domain/deck/enterprise/entities/enums/subject-type.ts'
import { Subject } from '@/domain/deck/enterprise/entities/subject.ts'

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
