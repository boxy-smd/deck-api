export interface ProjectMetadata {
  author?: {
    name: string
    username: string
    profileUrl: string | null
  }
  subject?: string
  trails?: string[]
  professors?: string[]
  comments?: Array<{
    id: string
    content: string
    createdAt: Date
    updatedAt: Date | null
    authorId: string
    author: {
      name: string
      username: string
      profileUrl: string | null
    }
  }>
}

export interface ProjectWithMetadata {
  metadata?: ProjectMetadata
}
