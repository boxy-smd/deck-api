import { Global, Module } from '@nestjs/common'
import { AuthenticationModule } from './authentication/authentication.module'
import { InteractionModule } from './interaction/interaction.module'
import { ProjectsModule } from './projects/projects.module'

@Global()
@Module({
  imports: [AuthenticationModule, ProjectsModule, InteractionModule],
  exports: [AuthenticationModule, ProjectsModule, InteractionModule],
})
export class DomainModule {}
