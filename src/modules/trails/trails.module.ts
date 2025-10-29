import { Module } from '@nestjs/common'
import { TrailsController } from './controllers/trails.controller'

@Module({
  controllers: [TrailsController],
})
export class TrailsModule {}
