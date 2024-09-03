import type { Repository } from '@/domain/core/interfaces/repository.ts'
import type {
  ProfileImage,
  ProfileImageProps,
} from '@/domain/entities/profile-image.entity.ts'

export type UpdateProfileImageRequest = Partial<Pick<ProfileImageProps, 'url'>>

export interface ProfileImagesRepository
  extends Repository<ProfileImage, UpdateProfileImageRequest> {
  findByUrl(url: string): Promise<ProfileImage | null>
}
