import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from './infra/database/prisma/prisma.module'
import { AuthModule } from './modules/auth/auth.module'
import { StudentsModule } from './modules/students/students.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    StudentsModule,
  ],
})
export class AppModule {}

