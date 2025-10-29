import type { HashComparer } from '@/domain/deck/application/cryptography/hash-comparer'
import type { HashGenerator } from '@/domain/deck/application/cryptography/hash-generator'

export class FakeHasher implements HashGenerator, HashComparer {
  async hash(plain: string): Promise<string> {
    return await Promise.resolve(plain.concat('-hashed'))
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return await Promise.resolve(plain.concat('-hashed') === hash)
  }
}
