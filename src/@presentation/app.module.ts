import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from './infra/database/prisma/prisma.module'
import { AuthModule } from './modules/auth/auth.module'
import { StudentsModule } from './modules/students/students.module'
import { ProfessorsModule } from './modules/professors/professors.module'
import { SubjectsModule } from './modules/subjects/subjects.module'
import { TrailsModule } from './modules/trails/trails.module'
import { ProjectsModule } from './modules/projects/projects.module'
import { CommentsModule } from './modules/comments/comments.module'
import { HealthController } from './shared/controllers/health.controller'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
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
