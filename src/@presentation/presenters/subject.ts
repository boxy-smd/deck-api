import type { Subject } from '@/@core/domain/projects/enterprise/entities/subject'

export class SubjectPresenter {
  static toHTTP(subject: Subject) {
    return {
      id: subject.id.toString(),
      name: subject.name,
      code: subject.code,
      workload: subject.workload,
      semester: subject.semester,
      type: subject.type,
    }
  }
}
