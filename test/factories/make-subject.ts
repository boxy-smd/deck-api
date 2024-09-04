import type { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import {
  Subject,
  type SubjectProps,
} from '@/domain/deck/enterprise/entities/subject.entity.ts'

export function makeSubject(
  override: Partial<SubjectProps> = {},
  id?: UniqueEntityID,
) {
  const subject = Subject.create(
    {
      name: 'Introdução à Sistemas e Mídias Digitais',
      ...override,
    },
    id,
  )

  return subject
}
