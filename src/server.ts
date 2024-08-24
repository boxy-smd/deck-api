import { app } from './app.ts'
import { env } from './infra/config/env.ts'

app.listen({
  host: '0.0.0.0',
  port: env.PORT,
})
