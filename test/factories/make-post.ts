import { UniqueEntityID } from '@/@shared/kernel/kernel/unique-entity-id'
import type { Post } from '@/@core/domain/projects/enterprise/value-objects/post'

export function makePost(override: Partial<Post> = {}): Post {
  const randomId = Math.random().toString(36).substring(7)
  
  const post: Post = {
    id: new UniqueEntityID(),
    title: 'Test Project Title',
    description: 'Test project description',
    bannerUrl: 'https://example.com/banner.jpg',
    publishedYear: 2024,
    semester: 1,
    allowComments: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    trails: [],
    professors: [],
    tags: [],
    authorId: new UniqueEntityID(),
    authorName: `Test Author ${randomId}`,
    authorUsername: `testauthor${randomId}`,
    professorName: `Test Professor ${randomId}`,
    ...override,
  }

  return post
}
