import { type Either, left, right } from '@/core/either.ts'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error.ts'
import type { ProjectsRepository } from '../repositories/projects-repository.ts'
import type { StorageUploader } from '../storage/uploader.ts'

interface UploadProjectBannerUseCaseRequest {
  projectId: string
  filename: string
  image: Buffer
}

type UploadProjectBannerUseCaseResponse = Either<ResourceNotFoundError, void>

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

    project.bannerUrl = downloadUrl

    await this.projectsRepository.save(project)

    return right(undefined)
  }
}
