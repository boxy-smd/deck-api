import { RegisterUseCase } from '@/domain/deck/application/use-cases/register.ts'
import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher.ts'
import { PrismaStudentsRepository } from '@/infra/database/prisma/repositories/students-repository.ts'
import { PrismaTrailsRepository } from '@/infra/database/prisma/repositories/trails-repository.ts'

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
