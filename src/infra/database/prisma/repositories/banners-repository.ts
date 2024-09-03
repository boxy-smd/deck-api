import type { Banner } from '@/domain/entities/banner.entity.ts'
import type { BannersRepository } from '@/domain/repositories/banners-repository.ts'
import { prisma } from '../client.ts'
import { BannerMapper } from '../mappers/banners-mapper.ts'

export class PrismaBannersRepository implements BannersRepository {
  async create(banner: Banner): Promise<Banner> {
    const raw = BannerMapper.toPersistence(banner)

    const createdRaw = await prisma.banner.create({
      data: raw,
    })

    return BannerMapper.toDomain(createdRaw)
  }

  async findById(id: string): Promise<Banner | null> {
    const raw = await prisma.banner.findUnique({
      where: { id },
    })

    return raw ? BannerMapper.toDomain(raw) : null
  }

  async findByUrl(url: string): Promise<Banner | null> {
    const raw = await prisma.banner.findFirst({
      where: { url },
    })

    return raw ? BannerMapper.toDomain(raw) : null
  }

  async update(id: string, banner: Banner): Promise<Banner | null> {
    const raw = BannerMapper.toPersistence(banner)

    const updatedBanner = await prisma.banner.update({
      where: { id },
      data: raw,
    })

    return BannerMapper.toDomain(updatedBanner)
  }

  async delete(id: string): Promise<void> {
    await prisma.banner.delete({
      where: { id },
    })
  }
}
