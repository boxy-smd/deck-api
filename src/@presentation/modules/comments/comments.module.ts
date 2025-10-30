import { InteractionsModule } from '@/@core/application/interactions/interaction.module'
import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { CommentsController } from './controllers/comments.controller'

@Module({
  imports: [AuthModule, InteractionsModule],
  controllers: [CommentsController],
})
export class CommentsModule {}
