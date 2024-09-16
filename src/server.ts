import { app } from './app.ts'
import { env } from './infra/config/env/env.ts'

app
  .listen({
    host: '0.0.0.0',
    port: env.PORT,
  })
  .then(() => {
    app.log.info(`Docs available at http://localhost:${env.PORT}/docs`)
  })
