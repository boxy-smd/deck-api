import type { ProfessorsRepository } from '@/domain/projects/application/repositories/professors-repository.ts'
import type { Professor } from '@/domain/projects/enterprise/entities/professor.ts'
import type { UniqueEntityID } from '@/shared/kernel/unique-entity-id.ts'

export class InMemoryProfessorsRepository implements ProfessorsRepository {
  public items: Professor[] = []

  async findById(id: string): Promise<Professor | null> {
    return Promise.resolve(
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
    await Promise.resolve(this.items.push(professor))
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

  async deleteById(id: UniqueEntityID): Promise<void> {
    const index = this.items.findIndex(item => item.id.equals(id))

    if (index !== -1) {
      this.items.splice(index, 1)
    }

    return await Promise.resolve()
  }

  async existsById(id: UniqueEntityID): Promise<boolean> {
    const index = this.items.findIndex(item => item.id.equals(id))
    return await Promise.resolve(index !== -1)
  }
}
