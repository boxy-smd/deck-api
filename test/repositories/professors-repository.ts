import type {
  ProfessorsRepository,
  UpdateProfessorRequest,
} from '@/domain/deck/application/repositories/professors-repository.ts'
import type { Professor } from '@/domain/deck/enterprise/entities/professor.entity.ts'

export class InMemoryProfessorsRepository implements ProfessorsRepository {
  private professors: Professor[] = []

  async create(professor: Professor): Promise<Professor> {
    this.professors.push(professor)
    return await Promise.resolve(professor)
  }

  async findById(id: string): Promise<Professor | null> {
    const professor = this.professors.find(professor => professor.id === id)
    return await Promise.resolve(professor ?? null)
  }

  async fetch(): Promise<Professor[]> {
    return await Promise.resolve(this.professors)
  }

  async fetchByName(name: string): Promise<Professor[]> {
    const professors = this.professors.filter(professor => {
      if (!professor.name.includes(name)) return false
      return true
    })

    return await Promise.resolve(professors)
  }

  async update(
    id: string,
    request: UpdateProfessorRequest,
  ): Promise<Professor | null> {
    const professor = this.professors.find(professor => professor.id === id)

    if (!professor) return await Promise.resolve(null)

    if (request.name) {
      professor.name = request.name
    }

    return await Promise.resolve(professor)
  }

  async delete(id: string): Promise<void> {
    this.professors = this.professors.filter(professor => professor.id !== id)
    return await Promise.resolve()
  }
}
