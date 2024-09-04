import type { SubjectsRepository } from '@/domain/deck/application/repositories/subjects-repository.ts'
import type { Subject } from '@/domain/deck/enterprise/entities/subject.ts'

export class InMemorySubjectsRepository implements SubjectsRepository {
  public items: Subject[] = []

  async create(subject: Subject): Promise<void> {
    await Promise.resolve(this.items.push(subject))
  }

  async findById(id: string): Promise<Subject | null> {
    return Promise.resolve(
      this.items.find(item => item.id.toString() === id) || null,
    )
  }

  async findByName(name: string): Promise<Subject | null> {
    return Promise.resolve(this.items.find(item => item.name === name) || null)
  }

  async findAll(): Promise<Subject[]> {
    return await Promise.resolve(this.items)
  }

  async findManyByName(name: string): Promise<Subject[]> {
    return await Promise.resolve(
      this.items.filter(item =>
        item.name.toLowerCase().includes(name.toLowerCase()),
      ),
    )
  }

  async save(subject: Subject): Promise<void> {
    const index = this.items.findIndex(item => item.id.equals(subject.id))

    if (index !== -1) {
      this.items[index] = subject
    }

    return await Promise.resolve()
  }

  async delete(subject: Subject): Promise<void> {
    const index = this.items.findIndex(item => item.id.equals(subject.id))

    if (index !== -1) {
      this.items.splice(index, 1)
    }

    return await Promise.resolve()
  }
}
