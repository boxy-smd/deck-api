import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { StudentsController } from './controllers/students.controller'

@Module({
  imports: [AuthModule],
  controllers: [StudentsController],
})
export class StudentsModule {}
