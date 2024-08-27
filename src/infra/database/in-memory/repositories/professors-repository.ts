import type {
  ProfessorsRepository,
  UpdateProfessorRequest,
} from '@/application/repositories/professors-repository.ts'
import type { Professor } from '@/domain/entities/professor.entity.ts'

export class InMemoryProfessorsRepository implements ProfessorsRepository {
  private professors: Professor[] = []

  create(professor: Professor): Promise<Professor> {
    this.professors.push(professor)
    return Promise.resolve(professor)
  }

  findById(id: string): Promise<Professor | null> {
    const professor = this.professors.find(professor => professor.id === id)
    return Promise.resolve(professor ?? null)
  }

  fetchByName(name: string): Promise<Professor[]> {
    const professors = this.professors.filter(professor => {
      if (!professor.name.includes(name)) return false
      return true
    })

    return Promise.resolve(professors)
  }
  update(
    id: string,
    request: UpdateProfessorRequest,
  ): Promise<Professor | null> {
    const professor = this.professors.find(professor => professor.id === id)

    if (!professor) return Promise.resolve(null)

    if (request.name) {
      professor.name = request.name
    }

    return Promise.resolve(professor)
  }

  delete(id: string): Promise<void> {
    this.professors = this.professors.filter(professor => professor.id !== id)
    return Promise.resolve()
  }
}
