import { SubjectsRepository } from '@/@core/application/projects/repositories/subjects-repository'
import { FetchSubjectsUseCase } from '@/@core/application/projects/use-cases/fetch-subjects'
import { PrismaSubjectsRepository } from '@/@infra/database/prisma/repositories/subjects-repository'
import { Module } from '@nestjs/common'
import { SubjectsController } from './controllers/subjects.controller'

@Module({
  controllers: [SubjectsController],
  providers: [
    FetchSubjectsUseCase,

    {
      provide: SubjectsRepository,
      useClass: PrismaSubjectsRepository,
    },
  ],
})
export class SubjectsModule {}
