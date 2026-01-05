import { extname } from 'node:path'
import { Injectable } from '@nestjs/common'
import { UsersRepository } from '@/@core/application/users/repositories/users-repository'
import { type Either, left, right } from '@/@shared/kernel/either'
import { ResourceNotFoundError } from '@/@shared/kernel/errors/resource-not-found.error'
import { StorageUploader } from '../storage/uploader'

interface UploadStudentProfileUseCaseRequest {
  username: string
  filename: string
  image: Buffer
}

type UploadStudentProfileUseCaseResponse = Either<ResourceNotFoundError, void>

@Injectable()
export class UploadStudentProfileUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly profilesUploader: StorageUploader,
  ) {}

  async execute({
    filename,
    image,
    username,
  }: UploadStudentProfileUseCaseRequest): Promise<UploadStudentProfileUseCaseResponse> {
    const student = await this.usersRepository.findByUsername(username)

    if (!student) {
      return left(new ResourceNotFoundError('Student not found.'))
    }

    const extension = extname(filename)
    const path = `profiles/${student.id.toString()}${extension}`

    const { downloadUrl } = await this.profilesUploader.upload(image, path)

    student.changeProfilePicture(downloadUrl)

    await this.usersRepository.save(student)

    return right(undefined)
  }
}
