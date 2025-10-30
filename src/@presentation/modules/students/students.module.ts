import { AuthenticationModule } from '@/@core/domain/authentication/authentication.module'
import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { StudentsController } from './controllers/students.controller'

@Module({
  imports: [AuthModule, AuthenticationModule],
  controllers: [StudentsController],
})
export class StudentsModule {}
