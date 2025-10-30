import { ProjectsModule as ProjectsDomainModule } from '@/@core/application/projects/projects.module'
import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { ProjectsController } from './controllers/projects.controller'

@Module({
  imports: [AuthModule, ProjectsDomainModule],
  controllers: [ProjectsController],
})
export class ProjectsModule {}
