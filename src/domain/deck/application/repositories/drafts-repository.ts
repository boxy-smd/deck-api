import type { Draft } from '../../enterprise/entities/draft.ts'

export interface DraftsRepository {
  findById(id: string): Promise<Draft | null>
  findManyByAuthorId(authorId: string): Promise<Draft[]>
  create(draft: Draft): Promise<void>
  save(draft: Draft): Promise<void>
  delete(id: string): Promise<void>
}
