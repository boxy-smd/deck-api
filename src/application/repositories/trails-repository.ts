import type { Repository } from '@/domain/core/interfaces/repository.ts'
import type { Trail, TrailProps } from '@/domain/entities/trail.entity.ts'

export type UpdateTrailRequest = Partial<Pick<TrailProps, 'name'>>

export interface TrailsRepository
  extends Repository<Trail, UpdateTrailRequest> {
  fetch(): Promise<Trail[]>
  findByName(name: string): Promise<Trail | null>
}
