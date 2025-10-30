import { InteractionModule } from '@/@core/domain/interaction/interaction.module'
import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { CommentsController } from './controllers/comments.controller'

@Module({
  imports: [AuthModule, InteractionModule],
  controllers: [CommentsController],
})
export class CommentsModule {}
