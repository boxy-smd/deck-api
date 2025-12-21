import type { StudentProfile } from '@/@core/domain/users/entities/student-profile'
import type { UniqueEntityID } from '@/@shared/kernel/kernel/unique-entity-id'

export class InMemoryStudentProfilesRepository
  implements InMemoryStudentProfilesRepository
{
  public items: StudentProfile[] = []

  async findByStudentId(studentId: string): Promise<StudentProfile | null> {
    const studentProfile = this.items.find(
      item => item.id.toString() === studentId,
    )
    return await Promise.resolve(studentProfile || null)
  }

  async findById(id: UniqueEntityID): Promise<StudentProfile | null> {
    const studentProfile = this.items.find(item => item.id.equals(id))
    return await Promise.resolve(studentProfile || null)
  }

  async findAll(): Promise<StudentProfile[]> {
    return await Promise.resolve(this.items)
  }

  async create(entity: StudentProfile): Promise<void> {
    this.items.push(entity)
    await Promise.resolve()
  }

  async save(entity: StudentProfile): Promise<void> {
    const index = this.items.findIndex(item => item.id.equals(entity.id))

    if (index !== -1) {
      this.items[index] = entity
    }
    await Promise.resolve()
  }

  async delete(entity: StudentProfile): Promise<void> {
    const index = this.items.findIndex(item => item.id.equals(entity.id))

    if (index !== -1) {
      this.items.splice(index, 1)
    }
    await Promise.resolve()
  }

  async deleteById(id: UniqueEntityID): Promise<void> {
    const index = this.items.findIndex(item => item.id.equals(id))

    if (index !== -1) {
      this.items.splice(index, 1)
    }
    await Promise.resolve()
  }

  async existsById(id: UniqueEntityID): Promise<boolean> {
    const exists = this.items.some(item => item.id.equals(id))
    return await Promise.resolve(exists)
  }
}
