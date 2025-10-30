import type { DeleteProjectUseCase } from '@/@core/domain/projects/application/use-cases/delete-project'
import type { GetProjectUseCase } from '@/@core/domain/projects/application/use-cases/get-project'
import type { PublishProjectUseCase } from '@/@core/domain/projects/application/use-cases/publish-project'
import type { SearchProjectsUseCase } from '@/@core/domain/projects/application/use-cases/search-projects'
import type { UploadProjectBannerUseCase } from '@/@core/domain/projects/application/use-cases/upload-project-banner'
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
import {
  ProjectDetailsResponseDto,
  ProjectsListResponseDto,
  PublishProjectResponseDto,
  UploadResponseDto,
} from '../dto/projects-response.dto'
import type { PublishProjectDto } from '../dto/publish-project.dto'

@ApiTags('Projects')
@Controller()
export class ProjectsController {
  constructor(
    private readonly publishProjectUseCase: PublishProjectUseCase,
    private readonly searchProjectsUseCase: SearchProjectsUseCase,
    private readonly getProjectUseCase: GetProjectUseCase,
    private readonly deleteProjectUseCase: DeleteProjectUseCase,
    private readonly uploadProjectBannerUseCase: UploadProjectBannerUseCase,
  ) {}

  @Post('projects')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publish a project' })
  @ApiResponse({
    status: 201,
    description: 'Project published successfully',
    type: PublishProjectResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Resource not found' })
  async publishProject(
    @Body() dto: PublishProjectDto,
    @Request() req: { user: { userId: string } },
  ): Promise<PublishProjectResponseDto> {
    const result = await this.publishProjectUseCase.execute({
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
  @ApiResponse({
    status: 200,
    description: 'Posts retrieved successfully',
    type: ProjectsListResponseDto,
  })
  async fetchPosts(
    @Query() query: FetchPostsDto,
  ): Promise<ProjectsListResponseDto> {
    const result = await this.searchProjectsUseCase.execute({})

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
  @ApiResponse({
    status: 200,
    description: 'Posts retrieved successfully',
    type: ProjectsListResponseDto,
  })
  async filterPosts(
    @Query() filter: FilterPostsDto,
  ): Promise<ProjectsListResponseDto> {
    const result = await this.searchProjectsUseCase.execute({
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
  @ApiResponse({
    status: 200,
    description: 'Project retrieved successfully',
    type: ProjectDetailsResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async getProject(
    @Param('projectId') projectId: string,
  ): Promise<ProjectDetailsResponseDto> {
    const result = await this.getProjectUseCase.execute({ projectId })

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
    @Request() req: { user: { userId: string } },
  ): Promise<void> {
    const result = await this.deleteProjectUseCase.execute({
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
  @ApiResponse({
    status: 200,
    description: 'Banner uploaded successfully',
    type: UploadResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async uploadBanner(
    @Param('projectId') projectId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadResponseDto> {
    if (!file) {
      throw new BadRequestException('File is required')
    }

    const result = await this.uploadProjectBannerUseCase.execute({
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
