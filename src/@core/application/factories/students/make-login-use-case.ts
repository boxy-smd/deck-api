import { LoginUseCase } from '@/@core/domain/authentication/application/use-cases/login'
import { BcryptHasher } from '@/@infra/cryptography/bcrypt-hasher'
import { PrismaProjectsRepository } from '@/@infra/database/prisma/repositories/projects-repository'
import { PrismaStudentsRepository } from '@/@infra/database/prisma/repositories/students-repository'

export function makeLoginUseCase() {
  const projectsRepository = new PrismaProjectsRepository()
  const studentsRepository = new PrismaStudentsRepository()
  const bcryptEncrypter = new BcryptHasher()
  const loginUseCase = new LoginUseCase(studentsRepository, bcryptEncrypter)

  return loginUseCase
}

