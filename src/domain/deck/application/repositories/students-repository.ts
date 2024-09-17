import type { Student } from '@/domain/deck/enterprise/entities/student.ts'
import type { StudentProfile } from '../../enterprise/entities/value-objects/student-profile.ts'

export interface StudentsRepository {
  findById(id: string): Promise<Student | null>
  findByEmail(email: string): Promise<Student | null>
  findByUsername(username: string): Promise<Student | null>
  findProfileById(id: string): Promise<StudentProfile | null>
  findProfileByUsername(username: string): Promise<StudentProfile | null>
  findManyByName(name: string): Promise<Student[]>
  findAll(): Promise<Student[]>
  create(user: Student): Promise<void>
  save(user: Student): Promise<void>
}
