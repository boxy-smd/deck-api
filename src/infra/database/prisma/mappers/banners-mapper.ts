import type { Prisma, Banner as RawBanner } from '@prisma/client'

import type { UpdateBannerRequest } from '@/application/repositories/banners-repository.ts'
import { Banner } from '@/domain/entities/banner.entity.ts'

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class BannerMapper {
  static toDomain(raw: RawBanner): Banner {
    const banner = Banner.create(
      {
        url: raw.url,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      raw.id,
    )

    return banner
  }

  static toPersistence(banner: Banner): Prisma.BannerCreateInput {
    return {
      id: banner.id,
      url: banner.url,
      createdAt: banner.createdAt,
      updatedAt: banner.updatedAt,
    }
  }

  static toPersistenceUpdate(
    banner: UpdateBannerRequest,
  ): Prisma.BannerUpdateInput {
    const raw: Prisma.BannerUpdateInput = {
      url: banner.url,
      updatedAt: new Date(),
    }

    return raw
  }
}
