import { Module } from '@nestjs/common'
import { AuthenticationUseCasesModule } from './application/use-cases/use-cases.module'

@Module({
  imports: [AuthenticationUseCasesModule],
  exports: [AuthenticationUseCasesModule],
})
export class AuthenticationModule {}
