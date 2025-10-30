import { Global, Module } from '@nestjs/common'
import {
  HASH_COMPARER,
  HASH_GENERATOR,
} from '@/@shared/kernel/dependency-tokens'
import { BcryptHasher } from './bcrypt-hasher'

@Global()
@Module({
  providers: [
    {
      provide: HASH_GENERATOR,
      useClass: BcryptHasher,
    },
    {
      provide: HASH_COMPARER,
      useClass: BcryptHasher,
    },
  ],
  exports: [HASH_GENERATOR, HASH_COMPARER],
})
export class CryptographyModule {}
