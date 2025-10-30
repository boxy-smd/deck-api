import { ProfessorsRepository } from '@/@core/application/projects/repositories/professors-repository'
import { ProjectsRepository } from '@/@core/application/projects/repositories/projects-repository'
import { SubjectsRepository } from '@/@core/application/projects/repositories/subjects-repository'
import { TrailsRepository } from '@/@core/application/projects/repositories/trails-repository'
import { DeleteProjectUseCase } from '@/@core/application/projects/use-cases/delete-project'
import { GetProjectUseCase } from '@/@core/application/projects/use-cases/get-project'
import { PublishProjectUseCase } from '@/@core/application/projects/use-cases/publish-project'
import { SearchProjectsUseCase } from '@/@core/application/projects/use-cases/search-projects'
import { UploadProjectBannerUseCase } from '@/@core/application/projects/use-cases/upload-project-banner'
import { UsersRepository } from '@/@core/application/users/repositories/users-repository'
import { PrismaProfessorsRepository } from '@/@infra/database/prisma/repositories/professors-repository'
import { PrismaProjectsRepository } from '@/@infra/database/prisma/repositories/projects-repository'
import { PrismaStudentsRepository } from '@/@infra/database/prisma/repositories/students-repository'
import { PrismaSubjectsRepository } from '@/@infra/database/prisma/repositories/subjects-repository'
import { PrismaTrailsRepository } from '@/@infra/database/prisma/repositories/trails-repository'
import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { ProjectsController } from './controllers/projects.controller'

@Module({
  imports: [AuthModule],
  controllers: [ProjectsController],
  providers: [
    PublishProjectUseCase,
    SearchProjectsUseCase,
    GetProjectUseCase,
    DeleteProjectUseCase,
    UploadProjectBannerUseCase,

    {
      provide: ProfessorsRepository,
      useClass: PrismaProfessorsRepository,
    },
    {
      provide: UsersRepository,
      useClass: PrismaStudentsRepository,
    },
    {
      provide: ProjectsRepository,
      useClass: PrismaProjectsRepository,
    },
    {
      provide: TrailsRepository,
      useClass: PrismaTrailsRepository,
    },
    {
      provide: SubjectsRepository,
      useClass: PrismaSubjectsRepository,
    },
  ],
})
export class ProjectsModule {}
