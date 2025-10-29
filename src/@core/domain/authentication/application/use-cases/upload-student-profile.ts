import type { UsersRepository } from '@/@core/domain/authentication/application/repositories/users-repository'
import { type Either, left, right } from '@/@shared/kernel/either'
import { ResourceNotFoundError } from '@/@shared/kernel/errors/resource-not-found.error'
import type { StorageUploader } from '../storage/uploader'

interface UploadStudentProfileUseCaseRequest {
  username: string
  filename: string
  image: Buffer
}

type UploadStudentProfileUseCaseResponse = Either<ResourceNotFoundError, void>

export class UploadStudentProfileUseCase {
  constructor(
    private readonly studentsRepository: UsersRepository,
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
