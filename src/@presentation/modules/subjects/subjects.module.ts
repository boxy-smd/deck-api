import { Module } from '@nestjs/common'
import { SubjectsController } from './controllers/subjects.controller'

@Module({
  controllers: [SubjectsController],
})
export class SubjectsModule {}
