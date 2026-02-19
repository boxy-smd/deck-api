import { randomUUID } from 'node:crypto'
import { extname } from 'node:path'
import { Injectable } from '@nestjs/common'
import { UsersRepository } from '@/@core/application/users/repositories/users-repository'
import { StorageUploader } from '@/@core/application/users/storage/uploader'
import { type Either, left, right } from '@/@shared/kernel/either'
import { ResourceNotFoundError } from '@/@shared/kernel/errors/resource-not-found.error'

interface UploadRichTextImageUseCaseRequest {
  userId: string
  filename: string
  image: Buffer
}

type UploadRichTextImageUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    url: string
  }
>

@Injectable()
export class UploadRichTextImageUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly richTextImagesUploader: StorageUploader,
  ) {}

  async execute({
    userId,
    filename,
    image,
  }: UploadRichTextImageUseCaseRequest): Promise<UploadRichTextImageUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError('User not found.'))
    }

    const extension = extname(filename)
    const path = `rich-text/${userId}/${randomUUID()}${extension}`

    const { downloadUrl } = await this.richTextImagesUploader.upload(
      image,
      path,
    )

    return right({
      url: downloadUrl,
    })
  }
}
