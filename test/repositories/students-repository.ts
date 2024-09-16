import type { StudentsRepository } from '@/domain/deck/application/repositories/students-repository.ts'
import type { Student } from '@/domain/deck/enterprise/entities/student.ts'
import { StudentProfile } from '@/domain/deck/enterprise/entities/value-objects/student-profile.ts'

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

  async findProfileByUsername(
    username: string,
  ): Promise<StudentProfile | null> {
    const student = this.items.find(item => item.username === username)

    if (!student) return null

    return await Promise.resolve(
      StudentProfile.create({
        id: student.id,
        name: student.name,
        username: student.username,
        profileUrl: student.profileUrl,
        createdAt: student.createdAt,
        updatedAt: student.updatedAt,
        posts: [],
        semester: student.semester,
        trails: [],
        about: student.about,
      }),
    )
  }

  async findByEmail(email: string): Promise<Student | null> {
    const student = this.items.find(item => item.email.value === email)
    return await Promise.resolve(student || null)
  }

  async findManyByName(name: string): Promise<Student[]> {
    const students = this.items.filter(item => {
      if (item.name.toLowerCase().includes(name.toLowerCase())) {
        return true
      }

      if (item.username.toLowerCase().includes(name.toLowerCase())) {
        return true
      }

      return false
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
