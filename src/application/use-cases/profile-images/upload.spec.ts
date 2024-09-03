import { beforeEach, describe, expect, it } from 'vitest'

import { ProfileImage } from '@/domain/entities/profile-image.entity.ts'
import { InMemoryProfileImagesRepository } from '@/infra/database/in-memory/repositories/profile-images-repository.ts'
import { InvalidCredentialsError } from '../errors/invalid-credentials.error.ts'
import { UploadProfileImageUseCase } from './upload.ts'

let profileImagesRepository: InMemoryProfileImagesRepository
let sut: UploadProfileImageUseCase

describe('profile images upload use case', () => {
  beforeEach(() => {
    profileImagesRepository = new InMemoryProfileImagesRepository()
    sut = new UploadProfileImageUseCase(profileImagesRepository)
  })

  it('should be able to upload a profileImage', async () => {
    const response = await sut.execute({
      url: 'profile.png',
    })

    expect(response.isRight()).toBe(true)
    expect(response.isRight() && response.value).toBeInstanceOf(ProfileImage)
  })

  it('should be able to upload multiple profileImages', async () => {
    const response1 = await sut.execute({
      url: 'profile1.png',
    })

    const response2 = await sut.execute({
      url: 'profile2.png',
    })

    expect(response1.isRight()).toBe(true)
    expect(response1.isRight() && response1.value).toBeInstanceOf(ProfileImage)

    expect(response2.isRight()).toBe(true)
    expect(response2.isRight() && response2.value).toBeInstanceOf(ProfileImage)
  })

  it('should return an error if the profileImage url is not provided', async () => {
    const response = await sut.execute({
      url: '',
    })

    expect(response.isLeft()).toBe(true)
    expect(response.isLeft() && response.value).toBeInstanceOf(
      InvalidCredentialsError,
    )
  })
})
