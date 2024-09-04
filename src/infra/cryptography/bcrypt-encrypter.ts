import { compare, hash } from 'bcrypt'

import type { HashComparer } from '@/domain/deck/application/use-cases/cryptography/hash-comparer.ts'
import type { HashGenerator } from '@/domain/deck/application/use-cases/cryptography/hash-generator.ts'

export class BcryptHasher implements HashGenerator, HashComparer {
  private HASH_SALT_LENGTH = 8

  hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_LENGTH)
  }

  compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash)
  }
}
