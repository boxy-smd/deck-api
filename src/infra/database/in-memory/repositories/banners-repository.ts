import type {
  BannersRepository,
  UpdateBannerRequest,
} from '@/application/repositories/banners-repository.ts'
import type { Banner } from '@/domain/entities/banner.entity.ts'

export class InMemoryBannersRepository implements BannersRepository {
  private banners: Banner[] = []

  async create(banner: Banner): Promise<Banner> {
    this.banners.push(banner)

    return await Promise.resolve(banner)
  }

  async findById(id: string): Promise<Banner | null> {
    const banner = this.banners.find(banner => banner.id === id)

    return await Promise.resolve(banner ?? null)
  }

  async findByUrl(url: string): Promise<Banner | null> {
    const banner = this.banners.find(banner => banner.url === url)

    return await Promise.resolve(banner ?? null)
  }

  async fetch(): Promise<Banner[]> {
    return await Promise.resolve(this.banners)
  }

  async update(
    id: string,
    { url }: UpdateBannerRequest,
  ): Promise<Banner | null> {
    const bannerIndex = this.banners.findIndex(banner => banner.id === id)

    if (bannerIndex === -1) return Promise.resolve(null)

    if (url) {
      this.banners[bannerIndex].url = url
    }

    return await Promise.resolve(this.banners[bannerIndex])
  }

  async delete(id: string): Promise<void> {
    this.banners = this.banners.filter(banner => banner.id !== id)
    return await Promise.resolve()
  }
}
