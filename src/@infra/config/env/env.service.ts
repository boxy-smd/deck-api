import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { Env } from './env'

@Injectable()
export class EnvService {
  constructor(private configService: ConfigService<Env, true>) {}

  get<T extends keyof Env>(key: T): Env[T] {
    const value = this.configService.get(key, { infer: true })

    if (key === 'PORT' && !value) {
      console.warn(
        '⚠️ PORT not found in config, using process.env.PORT or 10000',
      )

      return (process.env.PORT || '10000') as Env[T]
    }

    return value
  }
}
