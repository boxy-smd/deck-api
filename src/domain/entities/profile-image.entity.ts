import { Entity } from '../core/interfaces/entity.ts'
import type { Replace } from '../core/logic/replace.ts'

export interface ProfileImageProps {
  url: string
  createdAt: Date
  updatedAt: Date
}

export class ProfileImage extends Entity<ProfileImageProps> {
  get url(): string {
    return this.props.url
  }

  set url(url: string) {
    this.props.url = url
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  set updatedAt(updatedAt: Date) {
    this.props.updatedAt = updatedAt
  }

  static create(
    {
      createdAt = new Date(),
      updatedAt = new Date(),
      ...props
    }: Replace<
      ProfileImageProps,
      {
        createdAt?: Date
        updatedAt?: Date
      }
    >,
    id?: string,
  ): ProfileImage {
    return new ProfileImage(
      {
        ...props,
        createdAt,
        updatedAt,
      },
      id,
    )
  }
}
