import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common'
import { Public } from './modules/auth/decorators/public.decorator'

@Controller()
export class AppController {
  @Get()
  @Public()
  getRoot() {
    return {
      name: 'Deck API',
      version: '1.0.0',
      status: 'running',
      docs: '/docs',
    }
  }

  @Get('health')
  @Public()
  @HttpCode(HttpStatus.OK)
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    }
  }

  @Get('health-check')
  @Public()
  @HttpCode(HttpStatus.OK)
  getHealthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    }
  }
}
