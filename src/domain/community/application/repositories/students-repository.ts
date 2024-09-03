import type { Student } from '../../enterprise/student.entity.ts'

export interface StudentsRepository {
  findById(id: string): Promise<Student | null>
  findByEmail(email: string): Promise<Student | null>
  findByUsername(username: string): Promise<Student | null>
  create(user: Student): Promise<void>
  save(user: Student): Promise<void>
}
