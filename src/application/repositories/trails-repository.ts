import type { Repository } from '@/domain/core/interfaces/repository.ts'
import type { Trail, TrailProps } from '@/domain/entities/trail.entity.ts'

export type UpdateTrailRequest = Partial<
  Omit<TrailProps, 'createdAt' | 'updatedAt'>
>

export interface TrailsRepository
  extends Repository<Trail, UpdateTrailRequest> {
  findByName(name: string): Promise<Trail | null>
  fetch(): Promise<Trail[]>
}
