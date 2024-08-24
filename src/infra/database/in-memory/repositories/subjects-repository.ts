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

  findByCode(code: string): Promise<Subject | null> {
    const subject = this.subjects.find(subject => subject.code === code)
    return Promise.resolve(subject ?? null)
  }

  fetchByCode(code: string): Promise<Subject[]> {
    const subjects = this.subjects.filter(subject =>
      subject.code.toLowerCase().includes(code.toLowerCase()),
    )
    return Promise.resolve(subjects)
  }

  fetchByName(name: string): Promise<Subject[]> {
    const subjects = this.subjects.filter(subject =>
      subject.name.toLowerCase().includes(name.toLowerCase()),
    )
    return Promise.resolve(subjects)
  }

  update(
    id: string,
    { name, code }: UpdateSubjectRequest,
  ): Promise<Subject | null> {
    const subject = this.subjects.find(subject => subject.id === id)

    if (!subject) return Promise.resolve(null)

    if (name) {
      subject.name = name
    }

    if (code) {
      subject.code = code
    }

    subject.updatedAt = new Date()

    return Promise.resolve(subject)
  }

  delete(id: string): Promise<void> {
    this.subjects = this.subjects.filter(subject => subject.id !== id)
    return Promise.resolve()
  }
}
