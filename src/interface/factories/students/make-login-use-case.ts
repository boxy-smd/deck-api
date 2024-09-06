import { LoginUseCase } from '@/domain/deck/application/use-cases/login.ts'
import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher.ts'
import { PrismaStudentsRepository } from '@/infra/database/prisma/repositories/students-repository.ts'

export function makeLoginUseCase() {
  const studentsRepository = new PrismaStudentsRepository()
  const bcryptEncrypter = new BcryptHasher()
  const loginUseCase = new LoginUseCase(studentsRepository, bcryptEncrypter)

  return loginUseCase
}
