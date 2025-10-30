import { CommentsRepository } from '@/@core/application/interactions/repositories/comments-repository'
import { ReportsRepository } from '@/@core/application/interactions/repositories/reports-repository'
import { CommentOnProjectUseCase } from '@/@core/application/interactions/use-cases/comment-on-project'
import { DeleteCommentUseCase } from '@/@core/application/interactions/use-cases/delete-comment'
import { ListProjectCommentsUseCase } from '@/@core/application/interactions/use-cases/list-project-comments'
import { ReportCommentUseCase } from '@/@core/application/interactions/use-cases/report-comment'
import { ProjectsRepository } from '@/@core/application/projects/repositories/projects-repository'
import { UsersRepository } from '@/@core/application/users/repositories/users-repository'
import { PrismaCommentsRepository } from '@/@infra/database/prisma/repositories/comments-repository'
import { PrismaProjectsRepository } from '@/@infra/database/prisma/repositories/projects-repository'
import { PrismaReportsRepository } from '@/@infra/database/prisma/repositories/reports-repository'
import { PrismaStudentsRepository } from '@/@infra/database/prisma/repositories/students-repository'
import { Module } from '@nestjs/common'
import { CommentsController } from './controllers/comments.controller'

@Module({
  controllers: [CommentsController],
  providers: [
    CommentOnProjectUseCase,
    DeleteCommentUseCase,
    ListProjectCommentsUseCase,
    ReportCommentUseCase,

    {
      provide: CommentsRepository,
      useClass: PrismaCommentsRepository,
    },
    {
      provide: UsersRepository,
      useClass: PrismaStudentsRepository,
    },
    {
      provide: ProjectsRepository,
      useClass: PrismaProjectsRepository,
    },
    {
      provide: ReportsRepository,
      useClass: PrismaReportsRepository,
    },
  ],
})
export class CommentsModule {}
