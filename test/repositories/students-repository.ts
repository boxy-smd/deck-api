import type { StudentsRepository } from '@/domain/deck/application/repositories/students-repository.ts'
import type { Student } from '@/domain/deck/enterprise/entities/student.entity.ts'

export class InMemoryStudentsRepository implements StudentsRepository {
  private items: Student[] = []

  async findById(id: string): Promise<Student | null> {
    const student = this.items.find(item => item.id.toString() === id)

    return student || null
  }

  async findByUsername(username: string): Promise<Student | null> {
    const student = this.items.find(item => item.username === username)

    return student || null
  }

  async findByEmail(email: string): Promise<Student | null> {
    const student = this.items.find(item => item.email.value === email)

    return student || null
  }

  async create(user: Student): Promise<void> {
    this.items.push(user)

    return await Promise.resolve()
  }

  async save(user: Student): Promise<void> {
    const index = this.items.findIndex(item => item.id === user.id)

    this.items[index] = user

    return Promise.resolve()
  }
}
