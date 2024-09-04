import type { StudentTrailsRepository } from '@/domain/deck/application/repositories/student-trails-repository.ts'
import type { StudentTrail } from '@/domain/deck/enterprise/entities/student-trail.entity.ts'

export class InMemoryStudentTrailsRepository
  implements StudentTrailsRepository
{
  private items: StudentTrail[] = []

  async findManyByStudentId(studentId: string): Promise<StudentTrail[]> {
    const studentTrails = this.items.filter(
      item => item.studentId.toString() === studentId,
    )

    return studentTrails
  }
}
