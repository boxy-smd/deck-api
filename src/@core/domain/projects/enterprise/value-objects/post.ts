interface PostProps {
  id: string
  title: string
  description: string
  bannerUrl: string | null
  content: string | null
  publishedYear: number | null
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  semester: number | null
  createdAt: Date
  updatedAt: Date | null
  authorId: string
  author: {
    name: string
    username: string
    profileUrl: string | null
  }
  subjectId: string | null
  subject: {
    name: string
  } | null
  trails: {
    name: string
  }[]
  professors: {
    name: string
  }[]
}

export class Post {
  private readonly _props: PostProps

  constructor(props: PostProps) {
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

  get content(): string | null {
    return this._props.content
  }

  get publishedYear(): number | null {
    return this._props.publishedYear
  }

  get status(): 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' {
    return this._props.status
  }

  get semester(): number | null {
    return this._props.semester
  }

  get createdAt(): Date {
    return this._props.createdAt
  }

  get updatedAt(): Date | null {
    return this._props.updatedAt
  }

  get authorId(): string {
    return this._props.authorId
  }

  get author(): {
    name: string
    username: string
    profileUrl: string | null
  } {
    return this._props.author
  }

  get subjectId(): string | null {
    return this._props.subjectId
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

  get professors(): {
    name: string
  }[] {
    return this._props.professors
  }
}
