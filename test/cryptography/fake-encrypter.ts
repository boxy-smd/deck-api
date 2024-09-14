import type { Encrypter } from '@/domain/deck/application/cryptography/encrypter.ts'

export class FakeEncrypter implements Encrypter {
  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return await Promise.resolve(JSON.stringify(payload))
  }
}
