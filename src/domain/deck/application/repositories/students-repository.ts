import type { Student } from '@/domain/deck/enterprise/entities/student.ts'

export type StudentQuery = {
  name?: string
  username?: string
}

export interface StudentsRepository {
  findById(id: string): Promise<Student | null>
  findByEmail(email: string): Promise<Student | null>
  findByUsername(username: string): Promise<Student | null>
  findAll(): Promise<Student[]>
  findManyByQuery(query: StudentQuery): Promise<Student[]>
  create(user: Student): Promise<void>
  save(user: Student): Promise<void>
}
