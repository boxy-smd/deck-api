import { RegisterUseCase } from '@/@core/domain/authentication/application/use-cases/register'
import { BcryptHasher } from '@/@infra/cryptography/bcrypt-hasher'
import { PrismaStudentsRepository } from '@/@infra/database/prisma/repositories/students-repository'
import { PrismaTrailsRepository } from '@/@infra/database/prisma/repositories/trails-repository'

export function makeRegisterUseCase() {
  const studentsRepository = new PrismaStudentsRepository()
  const trailsRepository = new PrismaTrailsRepository()
  const bcryptHasher = new BcryptHasher()
  const registerUseCase = new RegisterUseCase(
    studentsRepository,
    trailsRepository,
    bcryptHasher,
  )

  return registerUseCase
}
