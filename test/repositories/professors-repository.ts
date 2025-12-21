import type { ProfessorsRepository } from '@/@core/application/professors/repositories/professors-repository'
import type { Professor } from '@/@core/domain/projects/entities/professor'

export class InMemoryProfessorsRepository implements ProfessorsRepository {
  public items: Professor[] = []

  async findById(id: string): Promise<Professor | null> {
    return await Promise.resolve(
      this.items.find(item => item.id.toString() === id) || null,
    )
  }

  async findAll(): Promise<Professor[]> {
    return await Promise.resolve(this.items)
  }

  async findManyByName(name: string): Promise<Professor[]> {
    return await Promise.resolve(
      this.items.filter(item =>
        item.name.toLowerCase().includes(name.toLowerCase()),
      ),
    )
  }

  async create(professor: Professor): Promise<void> {
    this.items.push(professor)
    await Promise.resolve()
  }

  async save(professor: Professor): Promise<void> {
    const index = this.items.findIndex(item => item.id.equals(professor.id))

    if (index !== -1) {
      this.items[index] = professor
    }
    await Promise.resolve()
  }

  async delete(professor: Professor): Promise<void> {
    const index = this.items.findIndex(item => item.id.equals(professor.id))

    if (index !== -1) {
      this.items.splice(index, 1)
    }
    await Promise.resolve()
  }

  async deleteById(id: string): Promise<void> {
    const index = this.items.findIndex(item => item.id.toString() === id)

    if (index !== -1) {
      this.items.splice(index, 1)
    }
    await Promise.resolve()
  }

  async existsById(id: string): Promise<boolean> {
    const index = this.items.findIndex(item => item.id.toString() === id)
    return await Promise.resolve(index !== -1)
  }
}
