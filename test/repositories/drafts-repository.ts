import type { DraftsRepository } from '@/domain/deck/application/repositories/drafts-repository.ts'
import type { Draft } from '@/domain/deck/enterprise/entities/draft.ts'

export class InMemoryDraftsRepository implements DraftsRepository {
  public items: Draft[] = []

  async findById(id: string): Promise<Draft | null> {
    return this.items.find(draft => draft.id.toString() === id) ?? null
  }

  async findManyByAuthorId(authorId: string): Promise<Draft[]> {
    return this.items.filter(draft => draft.authorId.toString() === authorId)
  }

  async create(draft: Draft): Promise<void> {
    await Promise.resolve(this.items.push(draft))
  }

  async save(draft: Draft) {
    const index = this.items.findIndex(item => item.id === draft.id)

    if (index !== -1) {
      this.items[index] = draft
    }

    return await Promise.resolve()
  }

  async delete(id: string) {
    this.items = this.items.filter(item => item.id.toString() !== id)
  }
}
