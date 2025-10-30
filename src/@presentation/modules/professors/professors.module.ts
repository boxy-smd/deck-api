import { ProjectsModule as ProjectsDomainModule } from '@/@core/domain/projects/projects.module'
import { Module } from '@nestjs/common'
import { ProfessorsController } from './controllers/professors.controller'

@Module({
  imports: [ProjectsDomainModule],
  controllers: [ProfessorsController],
})
export class ProfessorsModule {}
