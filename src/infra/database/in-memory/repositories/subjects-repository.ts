import type {
  SubjectsRepository,
  UpdateSubjectRequest,
} from '@/application/repositories/subjects-repository.ts'
import type { Subject } from '@/domain/entities/subject.entity.ts'

export class InMemorySubjectsRepository implements SubjectsRepository {
  private subjects: Subject[] = []

  create(subject: Subject): Promise<Subject> {
    this.subjects.push(subject)
    return Promise.resolve(subject)
  }

  findById(id: string): Promise<Subject | null> {
    const subject = this.subjects.find(subject => subject.id === id)
    return Promise.resolve(subject ?? null)
  }

  findByName(name: string): Promise<Subject | null> {
    const subject = this.subjects.find(subject => subject.name === name)
    return Promise.resolve(subject ?? null)
  }

  fetchByName(name: string): Promise<Subject[]> {
    const subjects = this.subjects.filter(subject => {
      if (!subject.name.includes(name)) return false
      return true
    })
    return Promise.resolve(subjects)
  }

  update(id: string, { name }: UpdateSubjectRequest): Promise<Subject | null> {
    const subject = this.subjects.find(subject => subject.id === id)

    if (!subject) return Promise.resolve(null)

    if (name) {
      subject.name = name
    }

    subject.updatedAt = new Date()

    return Promise.resolve(subject)
  }

  delete(id: string): Promise<void> {
    this.subjects = this.subjects.filter(subject => subject.id !== id)
    return Promise.resolve()
  }
}
