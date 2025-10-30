import { makeDeleteProjectUseCase } from '@/@core/application/factories/projects/make-delete-project-use-case'
import { makeGetProjectUseCase } from '@/@core/application/factories/projects/make-get-project-use-case'
import { makePublishProjectUseCase } from '@/@core/application/factories/projects/make-publish-project-use-case'
import { makeSearchProjectsUseCase } from '@/@core/application/factories/projects/make-search-projects-use-case'
import { makeUploadProjectBannerUseCase } from '@/@core/application/factories/projects/make-upload-project-banner-use-case'
import { JwtAuthGuard } from '@/@presentation/modules/auth/guards/jwt-auth.guard'
import { ProjectDetailsPresenter } from '@/@presentation/presenters/project-details'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import type { FetchPostsDto, FilterPostsDto } from '../dto/fetch-posts.dto'
import type { PublishProjectDto } from '../dto/publish-project.dto'

@ApiTags('Projects')
@Controller()
export class ProjectsController {
  @Post('projects')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publish a project' })
  @ApiResponse({ status: 201, description: 'Project published successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Resource not found' })
  async publishProject(@Body() dto: PublishProjectDto, @Request() req: any) {
    const publishProjectUseCase = makePublishProjectUseCase()

    const result = await publishProjectUseCase.execute({
      title: dto.title,
      description: dto.description,
      bannerUrl: dto.bannerUrl,
      content: dto.content,
      publishedYear: dto.publishedYear,
      semester: dto.semester,
      allowComments: dto.allowComments,
      authorId: req.user.userId,
      subjectId: dto.subjectId,
      trailsIds: dto.trailsIds,
      professorsIds: dto.professorsIds,
      draftId: dto.draftId,
    })

    if (result.isLeft()) {
      const error = result.value
      if (error.statusCode === 404) {
        throw new NotFoundException(error.message)
      }
      if (error.statusCode === 409) {
        throw new ConflictException(error.message)
      }
      throw new BadRequestException(error.message)
    }

    return {
      project_id: result.value.projectId,
    }
  }

  @Get('posts')
  @ApiOperation({ summary: 'Fetch posts' })
  @ApiResponse({ status: 200, description: 'Posts retrieved successfully' })
  async fetchPosts(@Query() query: FetchPostsDto) {
    const searchProjectsUseCase = makeSearchProjectsUseCase()

    const result = await searchProjectsUseCase.execute({})

    if (result.isLeft()) {
      throw new BadRequestException('Failed to fetch posts')
    }

    return {
      posts: result.value.items,
      pagination: {
        page: result.value.page,
        perPage: result.value.perPage,
        total: result.value.total,
        totalPages: result.value.totalPages,
      },
    }
  }

  @Get('posts/search')
  @ApiOperation({ summary: 'Search/Filter posts' })
  @ApiResponse({ status: 200, description: 'Posts retrieved successfully' })
  async filterPosts(@Query() filter: FilterPostsDto) {
    const searchProjectsUseCase = makeSearchProjectsUseCase()

    const result = await searchProjectsUseCase.execute({
      title: filter.title,
      professorName: filter.professorName,
      tags: filter.tags,
      subjectId: filter.subjectId,
      trailsIds: filter.trailsIds,
      semester: filter.semester,
      publishedYear: filter.publishedYear,
    })

    if (result.isLeft()) {
      throw new BadRequestException('Failed to search projects')
    }

    return {
      posts: result.value.items,
      pagination: {
        page: result.value.page,
        perPage: result.value.perPage,
        total: result.value.total,
        totalPages: result.value.totalPages,
      },
    }
  }

  @Get('projects/:projectId')
  @ApiOperation({ summary: 'Get project details' })
  @ApiResponse({ status: 200, description: 'Project retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async getProject(@Param('projectId') projectId: string) {
    const getProjectUseCase = makeGetProjectUseCase()

    const result = await getProjectUseCase.execute({ projectId })

    if (result.isLeft()) {
      const error = result.value
      if (error.statusCode === 404) {
        throw new NotFoundException(error.message)
      }
      throw new BadRequestException(error.message)
    }

    return ProjectDetailsPresenter.toHTTP(result.value)
  }

  @Delete('projects/:projectId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a project' })
  @ApiResponse({ status: 204, description: 'Project deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async deleteProject(
    @Param('projectId') projectId: string,
    @Request() req: any,
  ) {
    const deleteProjectUseCase = makeDeleteProjectUseCase()

    const result = await deleteProjectUseCase.execute({
      projectId,
      studentId: req.user.userId,
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

  @Post('projects/:projectId/banner')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload project banner' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Banner uploaded successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async uploadBanner(
    @Param('projectId') projectId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File is required')
    }

    const uploadUseCase = makeUploadProjectBannerUseCase()

    const result = await uploadUseCase.execute({
      projectId,
      filename: file.originalname,
      image: file.buffer,
    })

    if (result.isLeft()) {
      const error = result.value
      if (error.statusCode === 404) {
        throw new NotFoundException(error.message)
      }
      throw new BadRequestException(error.message)
    }

    return { message: 'Banner uploaded successfully' }
  }
}
