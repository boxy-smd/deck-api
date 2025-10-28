import type { SubjectsRepository } from '@/domain/projects/application/repositories/subjects-repository.ts'
import type { Subject } from '@/domain/projects/enterprise/entities/subject.ts'
import type { UniqueEntityID } from '@/shared/kernel/unique-entity-id.ts'

export class InMemorySubjectsRepository implements SubjectsRepository {
  public items: Subject[] = []

  async create(subject: Subject): Promise<void> {
    await Promise.resolve(this.items.push(subject))
  }

  async findById(id: UniqueEntityID): Promise<Subject | null> {
    return Promise.resolve(this.items.find(item => item.id.equals(id)) || null)
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

  async deleteById(id: UniqueEntityID): Promise<void> {
    const index = this.items.findIndex(item => item.id.equals(id))

    if (index !== -1) {
      this.items.splice(index, 1)
    }

    return await Promise.resolve()
  }

  async existsById(id: UniqueEntityID): Promise<boolean> {
    const index = this.items.findIndex(item => item.id.equals(id))
    return await Promise.resolve(index !== -1)
  }
}
