import { TrailsRepository } from '@/@core/application/projects/repositories/trails-repository'
import { FetchTrailsUseCase } from '@/@core/application/projects/use-cases/fetch-trails'
import { PrismaTrailsRepository } from '@/@infra/database/prisma/repositories/trails-repository'
import { Module } from '@nestjs/common'
import { TrailsController } from './controllers/trails.controller'

@Module({
  controllers: [TrailsController],
  providers: [
    FetchTrailsUseCase,

    {
      provide: TrailsRepository,
      useClass: PrismaTrailsRepository,
    },
  ],
})
export class TrailsModule {}
