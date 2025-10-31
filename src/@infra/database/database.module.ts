import { CommentsRepository } from '@/@core/application/interactions/repositories/comments-repository'
import { ReportsRepository } from '@/@core/application/interactions/repositories/reports-repository'
import { ProfessorsRepository } from '@/@core/application/projects/repositories/professors-repository'
import { ProjectsRepository } from '@/@core/application/projects/repositories/projects-repository'
import { SubjectsRepository } from '@/@core/application/projects/repositories/subjects-repository'
import { TrailsRepository } from '@/@core/application/projects/repositories/trails-repository'
import { UsersRepository } from '@/@core/application/users/repositories/users-repository'
import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaCommentsRepository } from './prisma/repositories/comments-repository'
import { PrismaProfessorsRepository } from './prisma/repositories/professors-repository'
import { PrismaProjectsRepository } from './prisma/repositories/projects-repository'
import { PrismaReportsRepository } from './prisma/repositories/reports-repository'
import { PrismaSubjectsRepository } from './prisma/repositories/subjects-repository'
import { PrismaTrailsRepository } from './prisma/repositories/trails-repository'
import { PrismaUsersRepository } from './prisma/repositories/users-repository'

@Module({
  providers: [
    PrismaService,
    PrismaReportsRepository,
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
    {
      provide: TrailsRepository,
      useClass: PrismaTrailsRepository,
    },
    {
      provide: SubjectsRepository,
      useClass: PrismaSubjectsRepository,
    },
    {
      provide: ProjectsRepository,
      useClass: PrismaProjectsRepository,
    },
    {
      provide: ProfessorsRepository,
      useClass: PrismaProfessorsRepository,
    },
    {
      provide: CommentsRepository,
      useClass: PrismaCommentsRepository,
    },
    {
      provide: ReportsRepository,
      useExisting: PrismaReportsRepository,
    },
  ],
  exports: [
    UsersRepository,
    TrailsRepository,
    SubjectsRepository,
    ProjectsRepository,
    ProfessorsRepository,
    CommentsRepository,
    ReportsRepository,
  ],
})
export class DatabaseModule {}
