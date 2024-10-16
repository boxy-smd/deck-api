import type { TrailsRepository } from '@/domain/deck/application/repositories/trails-repository.ts'
import type { Trail } from '@/domain/deck/enterprise/entities/trail.ts'

export class InMemoryTrailsRepository implements TrailsRepository {
  public items: Trail[] = []

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

  async findAll(): Promise<Trail[]> {
    return await Promise.resolve(this.items)
  }

  async findManyByName(name: string): Promise<Trail[]> {
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
