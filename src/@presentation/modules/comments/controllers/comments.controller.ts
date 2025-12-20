import { CommentOnProjectUseCase } from '@/@core/application/interactions/use-cases/comment-on-project'
import { DeleteCommentUseCase } from '@/@core/application/interactions/use-cases/delete-comment'
import { ListProjectCommentsUseCase } from '@/@core/application/interactions/use-cases/list-project-comments'
import { ReportCommentUseCase } from '@/@core/application/interactions/use-cases/report-comment'
import { Public } from '@/@presentation/modules/auth/decorators/public.decorator'
import { JwtAuthGuard } from '@/@presentation/modules/auth/guards/jwt-auth.guard'
import { CommentPresenter } from '@/@presentation/presenters/comment'
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
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
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { CommentOnProjectDto } from '../dto/comment-on-project.dto'
import {
  CommentCreatedResponseDto,
  CommentsListResponseDto,
  MessageResponseDto,
} from '../dto/comments-response.dto'
import { ReportCommentDto } from '../dto/report-comment.dto'

@ApiTags('Comentários')
@Controller()
export class CommentsController {
  constructor(
    private readonly commentOnProjectUseCase: CommentOnProjectUseCase,
    private readonly deleteCommentUseCase: DeleteCommentUseCase,
    private readonly listProjectCommentsUseCase: ListProjectCommentsUseCase,
    private readonly reportCommentUseCase: ReportCommentUseCase,
  ) {}
  @Public()

  @Get('projects/:projectId/comments')
  @ApiOperation({
    summary: 'Listar comentários do projeto',
    description:
      'Retorna todos os comentários de um projeto específico, ordenados do mais recente para o mais antigo.',
  })
  @ApiResponse({
    status: 200,
    description: 'Comentários retornados com sucesso.',
    type: CommentsListResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Projeto não encontrado.',
  })
  async listProjectComments(
    @Param('projectId') projectId: string,
  ): Promise<CommentsListResponseDto> {
    const result = await this.listProjectCommentsUseCase.execute({ projectId })

    if (result.isLeft()) {
      const error = result.value
      if (error.statusCode === 404) {
        throw new NotFoundException(error.message)
      }
      throw new BadRequestException(error.message)
    }

    return {
      comments: result.value.comments.map(CommentPresenter.toHTTP),
    }
  }

  @Post('projects/:projectId/comments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Comentar em projeto',
    description:
      'Adiciona um novo comentário a um projeto. Requer autenticação e o projeto deve permitir comentários.',
  })
  @ApiResponse({
    status: 201,
    description: 'Comentário criado com sucesso.',
    type: CommentCreatedResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Projeto não permite comentários.',
  })
  @ApiResponse({
    status: 404,
    description: 'Projeto não encontrado.',
  })
  @ApiBody({ type: CommentOnProjectDto })
  async commentOnProject(
    @Param('projectId') projectId: string,
    @Body() dto: CommentOnProjectDto,
    @Request() req: { user: { userId: string } },
  ): Promise<CommentCreatedResponseDto> {
    const result = await this.commentOnProjectUseCase.execute({
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
  @ApiOperation({
    summary: 'Excluir comentário',
    description:
      'Remove um comentário de um projeto. Apenas o autor do comentário pode excluí-lo.',
  })
  @ApiResponse({
    status: 204,
    description: 'Comentário excluído com sucesso.',
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado. Apenas o autor pode excluir o comentário.',
  })
  @ApiResponse({
    status: 404,
    description: 'Comentário não encontrado.',
  })
  async deleteComment(
    @Param('projectId') projectId: string,
    @Param('commentId') commentId: string,
    @Request() req: { user: { userId: string } },
  ): Promise<void> {
    const result = await this.deleteCommentUseCase.execute({
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

  @Post('reports/:commentId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Denunciar comentário',
    description: 'Reporta um comentário inadequado ou ofensivo para moderação.',
  })
  @ApiResponse({
    status: 201,
    description: 'Comentário denunciado com sucesso.',
    type: MessageResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Comentário não encontrado.',
  })
  @ApiBody({ type: ReportCommentDto })
  async reportComment(
    @Param('commentId') commentId: string,
    @Body() dto: ReportCommentDto,
    @Request() req: { user: { userId: string } },
  ): Promise<MessageResponseDto> {
    const result = await this.reportCommentUseCase.execute({
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
