import { Module } from '@nestjs/common'
import { ProfessorsController } from './controllers/professors.controller'

@Module({
  controllers: [ProfessorsController],
})
export class ProfessorsModule {}
