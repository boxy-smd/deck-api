import { ProjectsModule as ProjectsDomainModule } from '@/@core/application/projects/projects.module'
import { Module } from '@nestjs/common'
import { TrailsController } from './controllers/trails.controller'

@Module({
  imports: [ProjectsDomainModule],
  controllers: [TrailsController],
})
export class TrailsModule {}
