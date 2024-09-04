import type { TrailsRepository } from '@/domain/deck/application/repositories/trails-repository.ts'
import type { Trail } from '@/domain/deck/enterprise/entities/trail.entity.ts'

export class InMemoryTrailsRepository implements TrailsRepository {
  private items: Trail[] = []

  async create(trail: Trail): Promise<void> {
    await Promise.resolve(this.items.push(trail))
  }

  async findById(id: string): Promise<Trail | null> {
    return Promise.resolve(
      this.items.find(item => item.id.toString() === id) || null,
    )
  }

  async findByName(name: string): Promise<Trail | null> {
    return Promise.resolve(this.items.find(item => item.name === name) || null)
  }

  async fetchAll(): Promise<Trail[]> {
    return await Promise.resolve(this.items)
  }

  async fetchByName(name: string): Promise<Trail[]> {
    return await Promise.resolve(
      this.items.filter(item =>
        item.name.toLowerCase().includes(name.toLowerCase()),
      ),
    )
  }

  async save(trail: Trail): Promise<void> {
    const index = this.items.findIndex(item => item.id.equals(trail.id))

    if (index !== -1) {
      this.items[index] = trail
    }

    return await Promise.resolve()
  }

  async delete(trail: Trail): Promise<void> {
    const index = this.items.findIndex(item => item.id.equals(trail.id))

    if (index !== -1) {
      this.items.splice(index, 1)
    }

    return await Promise.resolve()
  }
}
