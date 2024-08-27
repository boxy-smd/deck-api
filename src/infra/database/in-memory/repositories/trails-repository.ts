import type { TrailsRepository } from '@/application/repositories/trails-repository.ts'
import type { Trail } from '@/domain/entities/trail.entity.ts'

export class InMemoryTrailsRepository implements TrailsRepository {
  private trails: Trail[] = []

  create(trail: Trail): Promise<Trail> {
    this.trails.push(trail)
    return Promise.resolve(trail)
  }

  findById(id: string): Promise<Trail | null> {
    const trail = this.trails.find(trail => trail.id === id)
    return Promise.resolve(trail ?? null)
  }

  findByName(name: string): Promise<Trail | null> {
    const trail = this.trails.find(trail => trail.name === name)
    return Promise.resolve(trail ?? null)
  }

  fetch(): Promise<Trail[]> {
    return Promise.resolve(this.trails)
  }

  update(id: string, trail: Trail): Promise<Trail | null> {
    const index = this.trails.findIndex(trail => trail.id === id)

    if (index < 0) return Promise.resolve(null)

    this.trails[index] = trail

    return Promise.resolve(trail)
  }

  delete(id: string): Promise<void> {
    this.trails = this.trails.filter(trail => trail.id !== id)
    return Promise.resolve()
  }
}
