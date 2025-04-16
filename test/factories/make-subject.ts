import type { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import { SubjectType } from '@/domain/deck/enterprise/entities/enums/subject-type.ts'
import {
  Subject,
  type SubjectProps,
} from '@/domain/deck/enterprise/entities/subject.ts'

export function makeSubject(
  override: Partial<SubjectProps> = {},
  id?: UniqueEntityID,
) {
  const subject = Subject.create(
    {
      name: 'Introdução à Sistemas e Mídias Digitais',
      code: 'SMD0094',
      workload: 64,
      semester: 1,
      type: SubjectType.OBLIGATORY,
      ...override,
    },
    id,
  )

  return subject
}
