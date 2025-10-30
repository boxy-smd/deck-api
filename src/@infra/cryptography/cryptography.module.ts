import { Global, Module } from '@nestjs/common'
import { BcryptHasher } from './bcrypt-hasher'

@Global()
@Module({
  providers: [BcryptHasher],
  exports: [BcryptHasher],
})
export class CryptographyModule {}
