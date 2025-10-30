import { Module } from '@nestjs/common'
import { InteractionsUseCasesModule } from './use-cases/use-cases.module'

@Module({
  imports: [InteractionsUseCasesModule],
  exports: [InteractionsUseCasesModule],
})
export class InteractionsModule {}
