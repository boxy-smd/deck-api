import type { UsersRepository } from '@/domain/authentication/application/repositories/users-repository.ts'
import { type Either, left, right } from '@/shared/either.ts'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found.error.ts'
import type { StorageUploader } from '../storage/uploader.ts'

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
