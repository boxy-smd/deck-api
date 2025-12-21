import { Module } from '@nestjs/common'
import { CommentsRepository } from '@/@core/application/interactions/repositories/comments-repository'
import { ReportsRepository } from '@/@core/application/interactions/repositories/reports-repository'
import { ProfessorsRepository } from '@/@core/application/professors/repositories/professors-repository'
import { ProjectsRepository } from '@/@core/application/projects/repositories/projects-repository'
import { SubjectsRepository } from '@/@core/application/subjects/repositories/subjects-repository'
import { TrailsRepository } from '@/@core/application/trails/repositories/trails-repository'
import { UsersRepository } from '@/@core/application/users/repositories/users-repository'
import { DrizzleCommentsRepository } from './drizzle/repositories/drizzle-comments-repository'
import { DrizzleProfessorsRepository } from './drizzle/repositories/drizzle-professors-repository'
import { DrizzleProjectsRepository } from './drizzle/repositories/drizzle-projects-repository'
import { DrizzleReportsRepository } from './drizzle/repositories/drizzle-reports-repository'
import { DrizzleSubjectsRepository } from './drizzle/repositories/drizzle-subjects-repository'
import { DrizzleTrailsRepository } from './drizzle/repositories/drizzle-trails-repository'
import { DrizzleUsersRepository } from './drizzle/repositories/drizzle-users-repository'

@Module({
  providers: [
    {
      provide: UsersRepository,
      useClass: DrizzleUsersRepository,
    },
    {
      provide: TrailsRepository,
      useClass: DrizzleTrailsRepository,
    },
    {
      provide: SubjectsRepository,
      useClass: DrizzleSubjectsRepository,
    },
    {
      provide: ProjectsRepository,
      useClass: DrizzleProjectsRepository,
    },
    {
      provide: ProfessorsRepository,
      useClass: DrizzleProfessorsRepository,
    },
    {
      provide: CommentsRepository,
      useClass: DrizzleCommentsRepository,
    },
    {
      provide: ReportsRepository,
      useClass: DrizzleReportsRepository,
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
