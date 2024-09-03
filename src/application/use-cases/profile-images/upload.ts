import { type Either, left, right } from '@/core/either.ts'
import { ProfileImage } from '@/domain/entities/profile-image.entity.ts'
import type { ProfileImagesRepository } from '@/domain/repositories/profile-images-repository.ts'
import { InvalidCredentialsError } from '../../../core/errors/invalid-credentials.error.ts'

interface UploadProfileImageUseCaseRequest {
  url: string
}

type UploadProfileImageUseCaseResponse = Either<
  InvalidCredentialsError,
  ProfileImage
>

export class UploadProfileImageUseCase {
  constructor(
    private readonly profileImagesRepository: ProfileImagesRepository,
  ) {}

  async execute({
    url,
  }: UploadProfileImageUseCaseRequest): Promise<UploadProfileImageUseCaseResponse> {
    if (!url) {
      return left(new InvalidCredentialsError('The url must be provided.'))
    }

    const profileImage = ProfileImage.create({ url })

    await this.profileImagesRepository.create(profileImage)

    return right(profileImage)
  }
}
