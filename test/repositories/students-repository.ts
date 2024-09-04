import type {
  StudentQuery,
  StudentsRepository,
} from '@/domain/deck/application/repositories/students-repository.ts'
import type { Student } from '@/domain/deck/enterprise/entities/student.ts'

export class InMemoryStudentsRepository implements StudentsRepository {
  public items: Student[] = []

  async findById(id: string): Promise<Student | null> {
    const student = this.items.find(item => item.id.toString() === id)
    return await Promise.resolve(student || null)
  }

  async findByUsername(username: string): Promise<Student | null> {
    const student = this.items.find(item => item.username === username)
    return await Promise.resolve(student || null)
  }

  async findByEmail(email: string): Promise<Student | null> {
    const student = this.items.find(item => item.email.value === email)
    return await Promise.resolve(student || null)
  }

  async findManyByQuery({ name, username }: StudentQuery): Promise<Student[]> {
    const students = this.items.filter(item => {
      if (name && !item.name.includes(name)) {
        return false
      }

      if (username && !item.username.includes(username)) {
        return false
      }

      return true
    })

    return await Promise.resolve(students)
  }

  async findAll(): Promise<Student[]> {
    const students = this.items

    return await Promise.resolve(students)
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
