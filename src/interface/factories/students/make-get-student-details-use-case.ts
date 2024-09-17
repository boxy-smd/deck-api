import { GetStudentDetailsUseCase } from '@/domain/deck/application/use-cases/get-student-details.ts'
import { PrismaProjectsRepository } from '@/infra/database/prisma/repositories/projects-repository.ts'
import { PrismaStudentsRepository } from '@/infra/database/prisma/repositories/students-repository.ts'

export function makeGetStudentDetailsUseCase() {
  const projectsRepository = new PrismaProjectsRepository()
  const studentRepository = new PrismaStudentsRepository(projectsRepository)
  const getStudentDetailsUseCase = new GetStudentDetailsUseCase(
    studentRepository,
  )

  return getStudentDetailsUseCase
}
