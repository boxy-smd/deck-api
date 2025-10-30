import { Global, Module } from '@nestjs/common'
import { CryptographyModule } from './cryptography/cryptography.module'
import { FirebaseModule } from './database/firebase/firebase.module'
import { PrismaModule } from './database/prisma/prisma.module'
import { RepositoriesModule } from './database/prisma/repositories/repositories.module'

@Global()
@Module({
  imports: [
    PrismaModule,
    FirebaseModule,
    CryptographyModule,
    RepositoriesModule,
  ],
  exports: [
    PrismaModule,
    FirebaseModule,
    CryptographyModule,
    RepositoriesModule,
  ],
})
export class InfraModule {}
