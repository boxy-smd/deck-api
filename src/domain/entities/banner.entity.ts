import { Entity } from '../core/interfaces/entity.ts'
import type { Replace } from '../core/logic/replace.ts'

export interface BannerProps {
  url: string
  createdAt: Date
  updatedAt: Date
}

export class Banner extends Entity<BannerProps> {
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
      BannerProps,
      {
        createdAt?: Date
        updatedAt?: Date
      }
    >,
    id?: string,
  ): Banner {
    return new Banner(
      {
        ...props,
        createdAt,
        updatedAt,
      },
      id,
    )
  }
}
