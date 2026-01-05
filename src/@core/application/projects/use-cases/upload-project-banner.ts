import { extname } from 'node:path'
import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '@/@shared/kernel/either'
import { ResourceNotFoundError } from '@/@shared/kernel/errors/resource-not-found.error'
import { StorageUploader } from '../../users/storage/uploader'
import { ProjectsRepository } from '../repositories/projects-repository'

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

    const extension = extname(filename)
    const path = `banners/${projectId}${extension}`

    const { downloadUrl } = await this.bannersUploader.upload(image, path)

    project.editInfo({
      bannerUrl: downloadUrl,
    })

    await this.projectsRepository.save(project)

    return right(undefined)
  }
}
