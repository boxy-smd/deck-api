import type { Trail, TrailProps } from '@/domain/entities/trail.entity.ts'

export type UpdateTrailRequest = Partial<
  Omit<TrailProps, 'createdAt' | 'updatedAt'>
>

export interface TrailsRepository {
  create(trail: Trail): Promise<Trail>
  findById(id: string): Promise<Trail | null>
  findByName(name: string): Promise<Trail | null>
  fetch(): Promise<Trail[]>
  update(id: string, request: UpdateTrailRequest): Promise<Trail | null>
  delete(id: string): Promise<void>
}
