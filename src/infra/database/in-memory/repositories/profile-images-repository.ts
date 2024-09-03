import type {
  ProfileImagesRepository,
  UpdateProfileImageRequest,
} from '@/application/repositories/profile-images-repository.ts'
import type { ProfileImage } from '@/domain/entities/profile-image.entity.ts'

export class InMemoryProfileImagesRepository
  implements ProfileImagesRepository
{
  private profileImages: ProfileImage[] = []

  async create(profileImage: ProfileImage): Promise<ProfileImage> {
    this.profileImages.push(profileImage)

    return await Promise.resolve(profileImage)
  }

  async findById(id: string): Promise<ProfileImage | null> {
    const profileImage = this.profileImages.find(
      profileImage => profileImage.id === id,
    )

    return await Promise.resolve(profileImage ?? null)
  }

  async findByUrl(url: string): Promise<ProfileImage | null> {
    const profileImage = this.profileImages.find(
      profileImage => profileImage.url === url,
    )

    return await Promise.resolve(profileImage ?? null)
  }

  async fetch(): Promise<ProfileImage[]> {
    return await Promise.resolve(this.profileImages)
  }

  async update(
    id: string,
    { url }: UpdateProfileImageRequest,
  ): Promise<ProfileImage | null> {
    const profileImageIndex = this.profileImages.findIndex(
      profileImage => profileImage.id === id,
    )

    if (profileImageIndex === -1) return Promise.resolve(null)

    if (url) {
      this.profileImages[profileImageIndex].url = url
    }

    return await Promise.resolve(this.profileImages[profileImageIndex])
  }

  async delete(id: string): Promise<void> {
    this.profileImages = this.profileImages.filter(
      profileImage => profileImage.id !== id,
    )
    return await Promise.resolve()
  }
}
