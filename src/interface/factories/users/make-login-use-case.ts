import { LoginUseCase } from '@/application/use-cases/users/login.ts'
import { BcryptEncrypter } from '@/infra/cryptography/bcrypt-encrypter.ts'
import { DrizzleUsersRepository } from '@/infra/database/drizzle/repositories/users-repository.ts'

export function makeLoginUseCase() {
  const usersRepository = new DrizzleUsersRepository()
  const bcryptEncrypter = new BcryptEncrypter()
  const loginUseCase = new LoginUseCase(usersRepository, bcryptEncrypter)

  return loginUseCase
}
