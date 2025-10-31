import type { Encrypter } from '@/@core/application/users/cryptography/encrypter'

export class FakeEncrypter implements Encrypter {
  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return await Promise.resolve(JSON.stringify(payload))
  }
}
