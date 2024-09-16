import type { Subject } from '@/domain/deck/enterprise/entities/subject.ts'

// biome-ignore lint/complexity/noStaticOnlyClass: This class is a presenter and should be static
export class SubjectPresenter {
  static toHTTP(subject: Subject) {
    return {
      id: subject.id.toString(),
      name: subject.name,
    }
  }
}
