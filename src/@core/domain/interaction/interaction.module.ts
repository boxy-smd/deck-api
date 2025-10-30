import { Module } from '@nestjs/common'
import { InteractionUseCasesModule } from './application/use-cases/use-cases.module'

@Module({
  imports: [InteractionUseCasesModule],
  exports: [InteractionUseCasesModule],
})
export class InteractionModule {}
