import type { Repository } from '@/domain/core/interfaces/repository.ts'
import type { Banner, BannerProps } from '@/domain/entities/banner.entity.ts'

export type UpdateBannerRequest = Partial<Pick<BannerProps, 'url'>>

export interface BannersRepository
  extends Repository<Banner, UpdateBannerRequest> {
  findByUrl(url: string): Promise<Banner | null>
}
