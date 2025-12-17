import { CommentOnProjectUseCase } from '@/@core/application/interactions/use-cases/comment-on-project'
import { DeleteCommentUseCase } from '@/@core/application/interactions/use-cases/delete-comment'
import { ListProjectCommentsUseCase } from '@/@core/application/interactions/use-cases/list-project-comments'
import { ReportCommentUseCase } from '@/@core/application/interactions/use-cases/report-comment'
import { DatabaseModule } from '@/@infra/database/database.module'
import { Module } from '@nestjs/common'
import { CommentsController } from '../comments/controllers/comments.controller'

@Module({
  imports: [DatabaseModule],
  controllers: [CommentsController],
  providers: [
    CommentOnProjectUseCase,
    DeleteCommentUseCase,
    ListProjectCommentsUseCase,
    ReportCommentUseCase,
  ],
})
export class InteractionsModule {}
