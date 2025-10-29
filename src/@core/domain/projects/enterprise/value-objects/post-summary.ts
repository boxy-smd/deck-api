interface PostSummaryProps {
  id: string
  title: string
  description: string
  bannerUrl: string | null
  publishedYear: number | null
  semester: number | null
  createdAt: Date
  author: {
    name: string
    username: string
    profileUrl: string | null
  }
  subject: {
    name: string
  } | null
  trails: {
    name: string
  }[]
}

export class PostSummary {
  private readonly _props: PostSummaryProps

  constructor(props: PostSummaryProps) {
    this._props = props
  }

  get id(): string {
    return this._props.id
  }

  get title(): string {
    return this._props.title
  }

  get description(): string {
    return this._props.description
  }

  get bannerUrl(): string | null {
    return this._props.bannerUrl
  }

  get publishedYear(): number | null {
    return this._props.publishedYear
  }

  get semester(): number | null {
    return this._props.semester
  }

  get createdAt(): Date {
    return this._props.createdAt
  }

  get author(): {
    name: string
    username: string
    profileUrl: string | null
  } {
    return this._props.author
  }

  get subject(): {
    name: string
  } | null {
    return this._props.subject
  }

  get trails(): {
    name: string
  }[] {
    return this._props.trails
  }

  static fromPost(post: {
    id: string
    title: string
    description: string
    bannerUrl: string | null
    publishedYear: number | null
    semester: number | null
    createdAt: Date
    author: {
      name: string
      username: string
      profileUrl: string | null
    }
    subject: {
      name: string
    } | null
    trails: {
      name: string
    }[]
  }): PostSummary {
    return new PostSummary({
      id: post.id,
      title: post.title,
      description: post.description,
      bannerUrl: post.bannerUrl,
      publishedYear: post.publishedYear,
      semester: post.semester,
      createdAt: post.createdAt,
      author: post.author,
      subject: post.subject,
      trails: post.trails,
    })
  }
}
