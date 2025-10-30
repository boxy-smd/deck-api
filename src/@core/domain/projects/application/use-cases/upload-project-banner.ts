import { type Either, left, right } from '@/@shared/kernel/either'
import { ResourceNotFoundError } from '@/@shared/kernel/errors/resource-not-found.error'
import { Injectable } from '@nestjs/common'
import type { StorageUploader } from '../../../authentication/application/storage/uploader'
import type { ProjectsRepository } from '../repositories/projects-repository'

interface UploadProjectBannerUseCaseRequest {
  projectId: string
  filename: string
  image: Buffer
}

type UploadProjectBannerUseCaseResponse = Either<ResourceNotFoundError, void>

@Injectable()
export class UploadProjectBannerUseCase {
  constructor(
    private readonly projectsRepository: ProjectsRepository,
    private readonly bannersUploader: StorageUploader,
  ) {}

  async execute({
    filename,
    image,
    projectId,
  }: UploadProjectBannerUseCaseRequest): Promise<UploadProjectBannerUseCaseResponse> {
    const project = await this.projectsRepository.findById(projectId)

    if (!project) {
      return left(new ResourceNotFoundError('Project not found.'))
    }

    const { downloadUrl } = await this.bannersUploader.upload(image, filename)

    project.editInfo({
      bannerUrl: downloadUrl,
    })

    await this.projectsRepository.save(project)

    return right(undefined)
  }
}
