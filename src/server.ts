import { app } from './app'
import { env } from './infra/config/env/env'

app
  .listen({
    host: '0.0.0.0',
    port: env.PORT,
  })
  .then(() => {
    app.log.info(`Docs available at http://localhost:${env.PORT}/docs`)
  })
