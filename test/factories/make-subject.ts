import {
  Subject,
  type SubjectProps,
} from '@/domain/projects/enterprise/entities/subject'
import { SubjectType } from '@/domain/projects/enterprise/value-objects/subject-type'
import type { UniqueEntityID } from '@/shared/kernel/unique-entity-id'

export function makeSubject(
  override: Partial<SubjectProps> = {},
  id?: UniqueEntityID,
) {
  const subject = Subject.create(
    {
      name: 'Introdução à Sistemas e Mídias Digitais',
      code: `SMD${Math.floor(Math.random() * 10000)}`,
      workload: 64,
      semester: 1,
      type: SubjectType.OBLIGATORY,
      ...override,
    },
    id,
  )

  return subject
}
