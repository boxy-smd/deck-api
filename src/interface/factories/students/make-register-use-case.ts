import { RegisterUseCase } from '@/domain/authentication/application/use-cases/register.ts'
import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher.ts'
import { PrismaProjectsRepository } from '@/infra/database/prisma/repositories/projects-repository.ts'
import { PrismaStudentsRepository } from '@/infra/database/prisma/repositories/students-repository.ts'
import { PrismaTrailsRepository } from '@/infra/database/prisma/repositories/trails-repository.ts'

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
