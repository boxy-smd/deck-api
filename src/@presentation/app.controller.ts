import { Controller, Get } from '@nestjs/common'

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return {
      name: 'Deck API',
      version: '1.0.0',
      status: 'running',
      docs: '/docs',
    }
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    }
  }

  @Get('health-check')
  getHealthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    }
  }
}
