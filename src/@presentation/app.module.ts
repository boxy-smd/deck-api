import { DomainModule } from '@/@core/domain/domain.module'
import { InfraModule } from '@/@infra/infra.module'
import { HealthController } from '@/@shared/kernel/controllers/health.controller'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './modules/auth/auth.module'
import { CommentsModule } from './modules/comments/comments.module'
import { ProfessorsModule } from './modules/professors/professors.module'
import { ProjectsModule } from './modules/projects/projects.module'
import { StudentsModule } from './modules/students/students.module'
import { SubjectsModule } from './modules/subjects/subjects.module'
import { TrailsModule } from './modules/trails/trails.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    InfraModule,
    DomainModule,
    AuthModule,
    StudentsModule,
    ProfessorsModule,
    SubjectsModule,
    TrailsModule,
    ProjectsModule,
    CommentsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
