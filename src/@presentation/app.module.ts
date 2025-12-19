import { envSchema } from '@/@infra/config/env/env'
import { EnvModule } from '@/@infra/config/env/env.module'
import { DrizzleModule } from '@/@infra/database/drizzle/drizzle.module'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './modules/auth/auth.module'
import { InteractionsModule } from './modules/interactions/interactions.module'
import { ProjectsModule } from './modules/projects/projects.module'
import { UsersModule } from './modules/users/users.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: env => {
        try {
          return envSchema.parse(env)
        } catch (error) {
          console.error('❌ Environment validation failed:', error)
          throw error
        }
      },
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    ProjectsModule,
    InteractionsModule,
    EnvModule,
    DrizzleModule,
  ],
})
export class AppModule {}
