import { UploadBannerUseCase } from '@/application/use-cases/banner/upload.ts'
import { PrismaBannersRepository } from '@/infra/database/prisma/repositories/banners-repository.ts'

export function makeUploadBannerUseCase() {
  const bannersRepository = new PrismaBannersRepository()
  const uploadBannerUseCase = new UploadBannerUseCase(bannersRepository)

  return uploadBannerUseCase
}
