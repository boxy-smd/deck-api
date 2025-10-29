import { makeCommentOnProjectUseCase } from '@/interface/factories/comments/make-comment-on-project-use-case'
import { makeDeleteCommentUseCase } from '@/interface/factories/comments/make-delete-comment-use-case'
import { makeReportCommentUseCase } from '@/interface/factories/comments/make-report-comment-use-case'
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard'
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import type { CommentOnProjectDto } from '../dto/comment-on-project.dto'
import type { ReportCommentDto } from '../dto/report-comment.dto'

@ApiTags('Comments')
@Controller()
export class CommentsController {
  @Post('projects/:projectId/comments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Comment on a project' })
  @ApiResponse({ status: 201, description: 'Comment created successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async commentOnProject(
    @Param('projectId') projectId: string,
    @Body() dto: CommentOnProjectDto,
    @Request() req: any,
  ) {
    const commentOnProjectUseCase = makeCommentOnProjectUseCase()

    const result = await commentOnProjectUseCase.execute({
      projectId,
      content: dto.content,
      authorId: req.user.userId,
    })

    if (result.isLeft()) {
      const error = result.value
      if (error.statusCode === 404) {
        throw new NotFoundException(error.message)
      }
      if (error.statusCode === 403) {
        throw new ForbiddenException(error.message)
      }
      throw new BadRequestException(error.message)
    }

    return {
      comment_id: result.value.commentId,
    }
  }

  @Delete('projects/:projectId/comments/:commentId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiResponse({ status: 204, description: 'Comment deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  async deleteComment(
    @Param('projectId') projectId: string,
    @Param('commentId') commentId: string,
    @Request() req: any,
  ) {
    const deleteCommentUseCase = makeDeleteCommentUseCase()

    const result = await deleteCommentUseCase.execute({
      authorId: req.user.userId,
      commentId,
      projectId,
    })

    if (result.isLeft()) {
      const error = result.value
      if (error.statusCode === 404) {
        throw new NotFoundException(error.message)
      }
      if (error.statusCode === 403) {
        throw new ForbiddenException(error.message)
      }
      throw new BadRequestException(error.message)
    }
  }

  @Post('comments/:commentId/report')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Report a comment' })
  @ApiResponse({ status: 201, description: 'Comment reported successfully' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  async reportComment(
    @Param('commentId') commentId: string,
    @Body() dto: ReportCommentDto,
    @Request() req: any,
  ) {
    const reportCommentUseCase = makeReportCommentUseCase()

    const result = await reportCommentUseCase.execute({
      authorId: req.user.userId,
      commentId,
      projectId: dto.projectId,
      content: dto.content,
    })

    if (result.isLeft()) {
      const error = result.value
      if (error.statusCode === 404) {
        throw new NotFoundException(error.message)
      }
      throw new BadRequestException(error.message)
    }

    return {
      message: 'Comment reported successfully.',
    }
  }
}
