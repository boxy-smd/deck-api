import { beforeEach, describe, expect, it } from 'vitest'

import { Banner } from '@/domain/entities/banner.entity.ts'
import { InMemoryBannersRepository } from '@/infra/database/in-memory/repositories/banners-repository.ts'
import { InvalidCredentialsError } from '../errors/invalid-credentials.error.ts'
import { UploadBannerUseCase } from './upload.ts'

let bannersRepository: InMemoryBannersRepository
let sut: UploadBannerUseCase

describe('banner upload use case', () => {
  beforeEach(() => {
    bannersRepository = new InMemoryBannersRepository()
    sut = new UploadBannerUseCase(bannersRepository)
  })

  it('should be able to upload a banner', async () => {
    const response = await sut.execute({
      url: 'banner1.png',
    })

    expect(response.isRight()).toBe(true)
    expect(response.isRight() && response.value).toBeInstanceOf(Banner)
  })

  it('should be able to upload multiple banners', async () => {
    const response1 = await sut.execute({
      url: 'banner1.png',
    })

    const response2 = await sut.execute({
      url: 'banner2.png',
    })

    expect(response1.isRight()).toBe(true)
    expect(response1.isRight() && response1.value).toBeInstanceOf(Banner)

    expect(response2.isRight()).toBe(true)
    expect(response2.isRight() && response2.value).toBeInstanceOf(Banner)
  })

  it('should return an error if the banner url is not provided', async () => {
    const response = await sut.execute({
      url: '',
    })

    expect(response.isLeft()).toBe(true)
    expect(response.isLeft() && response.value).toBeInstanceOf(
      InvalidCredentialsError,
    )
  })
})
