import {
  COMMENTS_REPOSITORY,
  PROFESSORS_REPOSITORY,
  PROJECTS_REPOSITORY,
  REPORTS_REPOSITORY,
  SUBJECTS_REPOSITORY,
  TRAILS_REPOSITORY,
  USERS_REPOSITORY,
} from '@/@shared/kernel/dependency-tokens'
import { Global, Module } from '@nestjs/common'
import { PrismaCommentsRepository } from './comments-repository'
import { PrismaProfessorsRepository } from './professors-repository'
import { PrismaProjectsRepository } from './projects-repository'
import { PrismaReportsRepository } from './reports-repository'
import { PrismaStudentsRepository } from './students-repository'
import { PrismaSubjectsRepository } from './subjects-repository'
import { PrismaTrailsRepository } from './trails-repository'

@Global()
@Module({
  providers: [
    {
      provide: USERS_REPOSITORY,
      useClass: PrismaStudentsRepository,
    },
    {
      provide: COMMENTS_REPOSITORY,
      useClass: PrismaCommentsRepository,
    },
    {
      provide: PROFESSORS_REPOSITORY,
      useClass: PrismaProfessorsRepository,
    },
    {
      provide: PROJECTS_REPOSITORY,
      useClass: PrismaProjectsRepository,
    },
    {
      provide: REPORTS_REPOSITORY,
      useClass: PrismaReportsRepository,
    },
    {
      provide: SUBJECTS_REPOSITORY,
      useClass: PrismaSubjectsRepository,
    },
    {
      provide: TRAILS_REPOSITORY,
      useClass: PrismaTrailsRepository,
    },
  ],
  exports: [
    USERS_REPOSITORY,
    COMMENTS_REPOSITORY,
    PROFESSORS_REPOSITORY,
    PROJECTS_REPOSITORY,
    REPORTS_REPOSITORY,
    SUBJECTS_REPOSITORY,
    TRAILS_REPOSITORY,
  ],
})
export class RepositoriesModule {}
