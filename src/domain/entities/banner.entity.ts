import { Entity } from '../core/interfaces/entity.ts'

interface BannerProps {
  name: string
  url: string
  createdAt: Date
  updatedAt: Date
  userId: string
}

export class Banner extends Entity<BannerProps> {
  get name(): string {
    return this.props.name
  }

  get url(): string {
    return this.props.url
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  get userId(): string {
    return this.props.userId
  }

  static create(props: BannerProps, id?: string): Banner {
    return new Banner(props, id)
  }
}
