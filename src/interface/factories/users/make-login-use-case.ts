import { LoginUseCase } from '@/application/use-cases/users/login.ts'
import { BcryptEncrypter } from '@/infra/cryptography/bcrypt-encrypter.ts'
import { PrismaUsersRepository } from '@/infra/database/prisma/repositories/users-repository.ts'

export function makeLoginUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const bcryptEncrypter = new BcryptEncrypter()
  const loginUseCase = new LoginUseCase(usersRepository, bcryptEncrypter)

  return loginUseCase
}
