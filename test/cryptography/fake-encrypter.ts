import type { Encrypter } from '@/@core/domain/authentication/application/cryptography/encrypter'

export class FakeEncrypter implements Encrypter {
  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return await Promise.resolve(JSON.stringify(payload))
  }
}
