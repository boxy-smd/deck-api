import { RegisterUseCase } from '@/application/use-cases/users/register.ts'
import { BcryptEncrypter } from '@/infra/cryptography/bcrypt-encrypter.ts'
import { PrismaTrailsRepository } from '@/infra/database/prisma/repositories/trails-repository.ts'
import { PrismaUsersRepository } from '@/infra/database/prisma/repositories/users-repository.ts'

export function makeRegisterUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const trailsRepository = new PrismaTrailsRepository()
  const bcryptEncrypter = new BcryptEncrypter()
  const registerUseCase = new RegisterUseCase(
    usersRepository,
    trailsRepository,
    bcryptEncrypter,
  )

  return registerUseCase
}
