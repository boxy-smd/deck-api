import { RegisterUseCase } from '@/domain/authentication/application/use-cases/register'
import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher'
import { PrismaProjectsRepository } from '@/infra/database/prisma/repositories/projects-repository'
import { PrismaStudentsRepository } from '@/infra/database/prisma/repositories/students-repository'
import { PrismaTrailsRepository } from '@/infra/database/prisma/repositories/trails-repository'

export function makeRegisterUseCase() {
  const projectsRepository = new PrismaProjectsRepository()
  const studentsRepository = new PrismaStudentsRepository(
    projectsRepository,
  )
  const trailsRepository = new PrismaTrailsRepository()
  const bcryptHasher = new BcryptHasher()
  const registerUseCase = new RegisterUseCase(
    studentsRepository,
    trailsRepository,
    bcryptHasher,
  )

  return registerUseCase
}
