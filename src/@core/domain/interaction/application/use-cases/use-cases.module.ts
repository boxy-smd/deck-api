import { Module } from '@nestjs/common'
import { CommentOnProjectUseCase } from './comment-on-project'
import { DeleteCommentUseCase } from './delete-comment'
import { ListProjectCommentsUseCase } from './list-project-comments'
import { ReportCommentUseCase } from './report-comment'

@Module({
  providers: [
    CommentOnProjectUseCase,
    DeleteCommentUseCase,
    ListProjectCommentsUseCase,
    ReportCommentUseCase,
  ],
  exports: [
    CommentOnProjectUseCase,
    DeleteCommentUseCase,
    ListProjectCommentsUseCase,
    ReportCommentUseCase,
  ],
})
export class InteractionUseCasesModule {}
