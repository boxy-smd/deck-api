import { Subject } from '@/domain/entities/subject.entity.ts'
import type { NewSubject, Subject as RawSubject } from '../schema.ts'

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class SubjectMapper {
  static toDomain(raw: RawSubject): Subject {
    const subject = Subject.create(
      {
        name: raw.name,
        createdAt: raw.createdAt || undefined,
        updatedAt: raw.updatedAt || undefined,
      },
      raw.id,
    )

    return subject
  }

  static toPersistence(subject: Subject): NewSubject {
    const raw: NewSubject = {
      id: subject.id,
      name: subject.name,
      createdAt: subject.createdAt,
      updatedAt: subject.updatedAt,
    }

    return raw
  }
}
