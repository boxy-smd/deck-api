import type { Encrypter } from '@/application/use-cases/users/cryptography/encrypter.ts'
import bcrypt from 'bcrypt'

export class BcryptEncrypter implements Encrypter {
  private SALT_ROUNDS = 6

  public async hash(data: string): Promise<string> {
    return await bcrypt.hash(data, this.SALT_ROUNDS)
  }

  public async compare(data: string, encryptedData: string): Promise<boolean> {
    return await bcrypt.compare(data, encryptedData)
  }
}
