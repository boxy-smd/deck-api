import type { Professor } from '@/@core/domain/projects/enterprise/entities/professor'

export class ProfessorPresenter {
  static toHTTP(professor: Professor) {
    return {
      id: professor.id.toString(),
      name: professor.name,
    }
  }
}
