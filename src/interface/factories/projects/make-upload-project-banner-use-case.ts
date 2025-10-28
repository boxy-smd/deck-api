import { UploadProjectBannerUseCase } from '@/domain/projects/application/use-cases/upload-project-banner.ts'
import { FirebaseBannerUploader } from '@/infra/database/firebase/banner-uploader.ts'
import { PrismaProjectsRepository } from '@/infra/database/prisma/repositories/projects-repository.ts'

export function makeUploadProjectBannerUseCase() {
  const firebaseBannerUploader = new FirebaseBannerUploader()
  const projectsRepository = new PrismaProjectsRepository()
  const uploadProjectBannerUseCase = new UploadProjectBannerUseCase(
    projectsRepository,
    firebaseBannerUploader,
  )

  return uploadProjectBannerUseCase
}
