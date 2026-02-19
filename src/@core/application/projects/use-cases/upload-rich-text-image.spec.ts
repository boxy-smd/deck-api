import { makeUser } from 'test/factories/make-user'
import { InMemoryUsersRepository } from 'test/repositories/users-repository'
import type { UsersRepository } from '@/@core/application/users/repositories/users-repository'
import { StorageUploader } from '@/@core/application/users/storage/uploader'
import { ResourceNotFoundError } from '@/@shared/kernel/errors/resource-not-found.error'
import { UploadRichTextImageUseCase } from './upload-rich-text-image'

class InMemoryStorageUploader implements StorageUploader {
  upload(
    _image: Buffer,
    path: string,
  ): Promise<{
    downloadUrl: string
  }> {
    return Promise.resolve({
      downloadUrl: `https://cdn.example.com/${path}`,
    })
  }
}

let usersRepository: UsersRepository
let storageUploader: StorageUploader
let sut: UploadRichTextImageUseCase

describe('upload rich text image use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    storageUploader = new InMemoryStorageUploader()
    sut = new UploadRichTextImageUseCase(usersRepository, storageUploader)
  })

  it('should be able to upload a rich text image', async () => {
    const user = await makeUser()
    await usersRepository.create(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      filename: 'editor-image.png',
      image: Buffer.from('fake-image-content'),
    })

    expect(result.isRight()).toBe(true)
    expect(result.isRight() && result.value).toMatchObject({
      url: expect.stringContaining('https://cdn.example.com/rich-text/'),
    })
  })

  it('should not upload if user does not exist', async () => {
    const result = await sut.execute({
      userId: 'non-existing-user-id',
      filename: 'editor-image.png',
      image: Buffer.from('fake-image-content'),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.isLeft() && result.value).toBeInstanceOf(
      ResourceNotFoundError,
    )
  })
})
