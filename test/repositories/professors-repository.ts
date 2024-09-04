import type { ProfessorsRepository } from '@/domain/deck/application/repositories/professors-repository.ts'
import type { Professor } from '@/domain/deck/enterprise/entities/professor.ts'

export class InMemoryProfessorsRepository implements ProfessorsRepository {
  private items: Professor[] = []

  async create(professor: Professor): Promise<void> {
    await Promise.resolve(this.items.push(professor))
  }

  async findById(id: string): Promise<Professor | null> {
    return Promise.resolve(
      this.items.find(item => item.id.toString() === id) || null,
    )
  }

  async fetchAll(): Promise<Professor[]> {
    return await Promise.resolve(this.items)
  }

  async fetchByName(name: string): Promise<Professor[]> {
    return await Promise.resolve(
      this.items.filter(item =>
        item.name.toLowerCase().includes(name.toLowerCase()),
      ),
    )
  }

  async save(professor: Professor): Promise<void> {
    const index = this.items.findIndex(item => item.id.equals(professor.id))

    if (index !== -1) {
      this.items[index] = professor
    }

    return await Promise.resolve()
  }

  async delete(professor: Professor): Promise<void> {
    const index = this.items.findIndex(item => item.id.equals(professor.id))

    if (index !== -1) {
      this.items.splice(index, 1)
    }

    return await Promise.resolve()
  }
}
