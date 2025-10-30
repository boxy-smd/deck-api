import { Module } from '@nestjs/common'
import { UsersUseCasesModule } from './use-cases/use-cases.module'

@Module({
  imports: [UsersUseCasesModule],
  exports: [UsersUseCasesModule],
})
export class UsersModule {}
