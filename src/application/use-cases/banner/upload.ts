import type { BannersRepository } from '@/application/repositories/banners-repository.ts'
import { type Either, left, right } from '@/domain/core/logic/either.ts'
import { Banner } from '@/domain/entities/banner.entity.ts'
import { InvalidCredentialsError } from '../errors/invalid-credentials.error.ts'

interface UploadBannerUseCaseRequest {
  url: string
}

type UploadBannerUseCaseResponse = Either<InvalidCredentialsError, Banner>

export class UploadBannerUseCase {
  constructor(private readonly bannersRepository: BannersRepository) {}

  async execute({
    url,
  }: UploadBannerUseCaseRequest): Promise<UploadBannerUseCaseResponse> {
    if (!url) {
      return left(new InvalidCredentialsError('The url must be provided.'))
    }

    const banner = Banner.create({ url })

    await this.bannersRepository.create(banner)

    return right(banner)
  }
}
