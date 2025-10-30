import { UploadProjectBannerUseCase } from '@/@core/domain/projects/application/use-cases/upload-project-banner'
import { FirebaseBannerUploader } from '@/@infra/database/firebase/banner-uploader'
import { FirebaseService } from '@/@infra/database/firebase/firebase.service'
import { PrismaProjectsRepository } from '@/@infra/database/prisma/repositories/projects-repository'

export function makeUploadProjectBannerUseCase() {
  const firebaseService = new FirebaseService()
  const firebaseBannerUploader = new FirebaseBannerUploader(firebaseService)
  const projectsRepository = new PrismaProjectsRepository()
  const uploadProjectBannerUseCase = new UploadProjectBannerUseCase(
    projectsRepository,
    firebaseBannerUploader,
  )

  return uploadProjectBannerUseCase
}
