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
    PrismaCommentsRepository,
    PrismaProfessorsRepository,
    PrismaProjectsRepository,
    PrismaReportsRepository,
    PrismaStudentsRepository,
    PrismaSubjectsRepository,
    PrismaTrailsRepository,
  ],
  exports: [
    PrismaCommentsRepository,
    PrismaProfessorsRepository,
    PrismaProjectsRepository,
    PrismaReportsRepository,
    PrismaStudentsRepository,
    PrismaSubjectsRepository,
    PrismaTrailsRepository,
  ],
})
export class RepositoriesModule {}
