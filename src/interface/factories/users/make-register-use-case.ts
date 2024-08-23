import { RegisterUseCase } from '@/application/use-cases/users/register.ts'
import { BcryptEncrypter } from '@/infra/cryptography/bcrypt-encrypter.ts'
import { DrizzleUsersRepository } from '@/infra/database/drizzle/repositories/users-repository.ts'

export function makeRegisterUseCase() {
  const usersRepository = new DrizzleUsersRepository()
  const bcryptEncrypter = new BcryptEncrypter()
  const registerUseCase = new RegisterUseCase(usersRepository, bcryptEncrypter)

  return registerUseCase
}
