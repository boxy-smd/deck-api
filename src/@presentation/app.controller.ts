import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common'
import { Public } from './modules/auth/decorators/public.decorator'

@Controller()
export class AppController {
  @Public()
  @Get()
  getRoot() {
    return {
      name: 'Deck API',
      version: '1.0.0',
      status: 'running',
      docs: '/docs',
    }
  }

  @Public()
  @Get('health')
  @HttpCode(HttpStatus.OK)
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    }
  }

  @Public()
  @Get('health-check')
  @HttpCode(HttpStatus.OK)
  getHealthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    }
  }
}
