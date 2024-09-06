import type { Trail } from '@/domain/deck/enterprise/entities/trail.ts'

export interface TrailsRepository {
  findById(id: string): Promise<Trail | null>
  findByName(name: string): Promise<Trail | null>
  findManyByName(name: string): Promise<Trail[]>
  findAll(): Promise<Trail[]>
  create(trail: Trail): Promise<void>
  save(trail: Trail): Promise<void>
}
