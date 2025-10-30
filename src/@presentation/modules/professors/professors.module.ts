import { ProfessorsRepository } from '@/@core/application/projects/repositories/professors-repository'
import { FetchProfessorsUseCase } from '@/@core/application/projects/use-cases/fetch-professors'
import { PrismaProfessorsRepository } from '@/@infra/database/prisma/repositories/professors-repository'
import { Module } from '@nestjs/common'
import { ProfessorsController } from './controllers/professors.controller'

@Module({
  controllers: [ProfessorsController],
  providers: [
    FetchProfessorsUseCase,

    {
      provide: ProfessorsRepository,
      useClass: PrismaProfessorsRepository,
    },
  ],
})
export class ProfessorsModule {}
