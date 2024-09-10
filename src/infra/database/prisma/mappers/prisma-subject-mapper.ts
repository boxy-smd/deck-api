import { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import { Subject } from '@/domain/deck/enterprise/entities/subject.ts'
import type { Prisma, Subject as SubjectRaw } from '@prisma/client'

// biome-ignore lint/complexity/noStaticOnlyClass: This class is a mapper and should have only static methods
export class PrismaSubjectMapper {
  static toEntity(raw: SubjectRaw): Subject {
    return Subject.create(
      {
        name: raw.name,
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
      createdAt: subject.createdAt,
      updatedAt: subject.updatedAt ?? undefined,
    }
  }
}
