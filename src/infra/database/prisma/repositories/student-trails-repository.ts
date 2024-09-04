import type { StudentTrailsRepository } from '@/domain/deck/application/repositories/student-trails-repository.ts'
import type { StudentTrail } from '@/domain/deck/enterprise/entities/student-trail.ts'

export class InMemoryStudentTrailsRepository
  implements StudentTrailsRepository
{
  public items: StudentTrail[] = []

  async findManyByStudentId(studentId: string): Promise<StudentTrail[]> {
    const studentTrails = this.items.filter(
      item => item.studentId.toString() === studentId,
    )

    return studentTrails
  }

  async create(studentTrail: StudentTrail): Promise<void> {
    await Promise.resolve(this.items.push(studentTrail))
  }

  async delete(studentTrail: StudentTrail): Promise<void> {
    const index = this.items.findIndex(item => item.id.equals(studentTrail.id))

    if (index !== -1) {
      this.items.splice(index, 1)
    }

    return await Promise.resolve()
  }

  async createMany(studentTrails: StudentTrail[]): Promise<void> {
    await Promise.resolve(this.items.push(...studentTrails))
  }
}
