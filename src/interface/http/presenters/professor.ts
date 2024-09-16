import type { Professor } from '@/domain/deck/enterprise/entities/professor.ts'

// biome-ignore lint/complexity/noStaticOnlyClass: This class is a presenter and should be static
export class ProfessorPresenter {
  static toHTTP(professor: Professor) {
    return {
      id: professor.id.toString(),
      name: professor.name,
    }
  }
}
