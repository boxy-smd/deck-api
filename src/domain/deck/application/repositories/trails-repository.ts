import type { Trail } from '@/domain/deck/enterprise/entities/trail.ts'

export interface TrailsRepository {
  findById(id: string): Promise<Trail | null>
  findByName(name: string): Promise<Trail | null>
  fetchAll(): Promise<Trail[]>
  fetchByName(name: string): Promise<Trail[]>
  create(trail: Trail): Promise<void>
  save(trail: Trail): Promise<void>
}
