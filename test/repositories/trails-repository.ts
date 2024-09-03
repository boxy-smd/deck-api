@/domain/deck/enterprise/entities/trail.entity.tsion/repositories/trails-repository.ts'
import type { Trail } from '@/domain/entities/trail.entity.ts'

export class InMemoryTrailsRepository implements TrailsRepository {
  private trails: Trail[] = []

  async create(trail: Trail): Promise<Trail> {
    this.trails.push(trail)
    return await Promise.resolve(trail)
  }

  async findById(id: string): Promise<Trail | null> {
    const trail = this.trails.find(trail => trail.id === id)
    return await Promise.resolve(trail ?? null)
  }

  async findByName(name: string): Promise<Trail | null> {
    const trail = this.trails.find(trail => trail.name === name)
    return await Promise.resolve(trail ?? null)
  }

  async fetch(): Promise<Trail[]> {
    return await Promise.resolve(this.trails)
  }

  async update(id: string, trail: Trail): Promise<Trail | null> {
    const index = this.trails.findIndex(trail => trail.id === id)

    if (index < 0) return await Promise.resolve(null)

    this.trails[index] = trail

    return await Promise.resolve(trail)
  }

  async delete(id: string): Promise<void> {
    this.trails = this.trails.filter(trail => trail.id !== id)
    return await Promise.resolve()
  }
}
