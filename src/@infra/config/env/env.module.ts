import { Global, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './env'
import { EnvService } from './env.service'

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      validate: env => {
        try {
          const parsed = envSchema.parse(env)
          console.log('✅ Environment variables validated successfully')
          console.log('📍 PORT:', parsed.PORT)
          return parsed
        } catch (error) {
          console.error('❌ Environment validation failed:', error)

          if (process.env.NODE_ENV === 'production') {
            throw new Error('Invalid environment variables')
          }

          return env
        }
      },
      isGlobal: true,
    }),
  ],
  providers: [EnvService],
  exports: [EnvService],
})
export class EnvModule {}
