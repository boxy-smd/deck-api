import { Subject } from '@/@core/domain/projects/entities/subject'
import { SubjectType } from '@/@core/domain/projects/value-objects/subject-type'
import { UniqueEntityID } from '@/@shared/kernel/kernel/unique-entity-id'
import { InferSelectModel } from 'drizzle-orm'
import { subjects } from '../schema'

type SubjectRaw = InferSelectModel<typeof subjects>

export class DrizzleSubjectMapper {
  static toEntity(raw: SubjectRaw): Subject {
    return Subject.create(
      {
        name: raw.name,
        code: raw.code,
        semester: raw.semester,
        workload: raw.workload,
        type: raw.type as SubjectType,
      },
      new UniqueEntityID(raw.id),
    )
  }
}
