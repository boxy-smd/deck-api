import type { Subject } from '@/domain/entities/subject.entity.ts'
import type {
  SubjectsRepository,
  UpdateSubjectRequest,
} from '@/domain/repositories/subjects-repository.ts'

export class InMemorySubjectsRepository implements SubjectsRepository {
  private subjects: Subject[] = []

  async create(subject: Subject): Promise<Subject> {
    this.subjects.push(subject)
    return await Promise.resolve(subject)
  }

  async findById(id: string): Promise<Subject | null> {
    const subject = this.subjects.find(subject => subject.id === id)
    return await Promise.resolve(subject ?? null)
  }

  async findByName(name: string): Promise<Subject | null> {
    const subject = this.subjects.find(subject => subject.name === name)
    return await Promise.resolve(subject ?? null)
  }

  async fetch(): Promise<Subject[]> {
    return await Promise.resolve(this.subjects)
  }

  async fetchByName(name: string): Promise<Subject[]> {
    const subjects = this.subjects.filter(subject => {
      if (!subject.name.includes(name)) return false
      return true
    })
    return await Promise.resolve(subjects)
  }

  async update(
    id: string,
    { name }: UpdateSubjectRequest,
  ): Promise<Subject | null> {
    const subject = this.subjects.find(subject => subject.id === id)

    if (!subject) return await Promise.resolve(null)

    if (name) {
      subject.name = name
    }

    subject.updatedAt = new Date()

    return await Promise.resolve(subject)
  }

  async delete(id: string): Promise<void> {
    this.subjects = this.subjects.filter(subject => subject.id !== id)
    return await Promise.resolve()
  }
}
