import { ProjectsModule as ProjectsDomainModule } from '@/@core/application/projects/projects.module'
import { Module } from '@nestjs/common'
import { SubjectsController } from './controllers/subjects.controller'

@Module({
  imports: [ProjectsDomainModule],
  controllers: [SubjectsController],
})
export class SubjectsModule {}
