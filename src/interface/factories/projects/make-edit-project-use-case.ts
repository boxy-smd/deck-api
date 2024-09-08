import { EditProjectUseCase } from '@/domain/deck/application/use-cases/edit-project.ts'
import { PrismaProfessorsRepository } from '@/infra/database/prisma/repositories/professors-repository.ts'
import { PrismaProjectsRepository } from '@/infra/database/prisma/repositories/projects-repository.ts'
import { PrismaStudentsRepository } from '@/infra/database/prisma/repositories/students-repository.ts'
import { PrismaSubjectsRepository } from '@/infra/database/prisma/repositories/subjects-repository.ts'
import { PrismaTrailsRepository } from '@/infra/database/prisma/repositories/trails-repository.ts'

export function makeEditProjectUseCase() {
  const projectsRepository = new PrismaProjectsRepository()
  const studentsRepository = new PrismaStudentsRepository()
  const subjectsRepository = new PrismaSubjectsRepository()
  const trailsRepository = new PrismaTrailsRepository()
  const professorsRepository = new PrismaProfessorsRepository()
  const editProjectUseCase = new EditProjectUseCase(
    projectsRepository,
    studentsRepository,
    subjectsRepository,
    trailsRepository,
    professorsRepository,
  )

  return editProjectUseCase
}
