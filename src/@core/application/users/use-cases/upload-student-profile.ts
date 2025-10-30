import type { UsersRepository } from '@/@core/application/users/repositories/users-repository'
import {
  STORAGE_UPLOADER,
  USERS_REPOSITORY,
} from '@/@shared/kernel/dependency-tokens'
import { type Either, left, right } from '@/@shared/kernel/either'
import { ResourceNotFoundError } from '@/@shared/kernel/errors/resource-not-found.error'
import { Inject, Injectable } from '@nestjs/common'
import type { StorageUploader } from '../storage/uploader'

interface UploadStudentProfileUseCaseRequest {
  username: string
  filename: string
  image: Buffer
}

type UploadStudentProfileUseCaseResponse = Either<ResourceNotFoundError, void>

@Injectable()
export class UploadStudentProfileUseCase {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly studentsRepository: UsersRepository,
    @Inject(STORAGE_UPLOADER)
    private readonly profilesUploader: StorageUploader,
  ) {}

  async execute({
    filename,
    image,
    username,
  }: UploadStudentProfileUseCaseRequest): Promise<UploadStudentProfileUseCaseResponse> {
    const student = await this.studentsRepository.findByUsername(username)

    if (!student) {
      return left(new ResourceNotFoundError('Student not found.'))
    }

    const { downloadUrl } = await this.profilesUploader.upload(image, filename)

    student.changeProfilePicture(downloadUrl)

    await this.studentsRepository.save(student)

    return right(undefined)
  }
}
