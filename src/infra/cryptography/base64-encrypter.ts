import type { Encrypter } from '@/application/use-cases/users/cryptography/encrypter.ts'

export class Base64Encrypter implements Encrypter {
  public async hash(data: string): Promise<string> {
    return await Promise.resolve(Buffer.from(data, 'base64').toString())
  }

  public async compare(data: string, encryptedData: string): Promise<boolean> {
    return await Promise.resolve(
      Buffer.from(data, 'base64').toString() === encryptedData,
    )
  }
}
