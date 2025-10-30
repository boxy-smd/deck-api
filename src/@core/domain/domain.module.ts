import { Global, Module } from '@nestjs/common'
import { InteractionsModule } from '../application/interactions/interaction.module'
import { ProjectsModule } from '../application/projects/projects.module'
import { UsersModule } from '../application/users/users.module'

@Global()
@Module({
  imports: [UsersModule, ProjectsModule, InteractionsModule],
  exports: [UsersModule, ProjectsModule, InteractionsModule],
})
export class DomainModule {}
