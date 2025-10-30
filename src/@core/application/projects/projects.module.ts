import { Module } from '@nestjs/common'
import { ProjectsUseCasesModule } from './application/use-cases/use-cases.module'

@Module({
  imports: [ProjectsUseCasesModule],
  exports: [ProjectsUseCasesModule],
})
export class ProjectsModule {}
