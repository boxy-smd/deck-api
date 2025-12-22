import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common'

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
  @HttpCode(HttpStatus.OK)
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    }
  }

  @Get('health-check')
  @HttpCode(HttpStatus.OK)
  getHealthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    }
  }
}
