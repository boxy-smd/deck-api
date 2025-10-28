import { LoginUseCase } from '@/domain/authentication/application/use-cases/login.ts'
import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher.ts'
import { PrismaProjectsRepository } from '@/infra/database/prisma/repositories/projects-repository.ts'
import { PrismaStudentsRepository } from '@/infra/database/prisma/repositories/students-repository.ts'

export function makeLoginUseCase() {
  const projectsRepository = new PrismaProjectsRepository()
  const studentsRepository = new PrismaStudentsRepository(
    projectsRepository,
  )
  const bcryptEncrypter = new BcryptHasher()
  const loginUseCase = new LoginUseCase(studentsRepository, bcryptEncrypter)

  return loginUseCase
}
