import { makeDeleteProjectUseCase } from '@/interface/factories/projects/make-delete-project-use-case'
import { makeFetchPostsUseCase } from '@/interface/factories/projects/make-fetch-posts-use-case'
import { makeFilterPostsByQueryUseCase } from '@/interface/factories/projects/make-filter-posts-by-query-use-case'
import { makeGetProjectUseCase } from '@/interface/factories/projects/make-get-project-use-case'
import { makePublishProjectUseCase } from '@/interface/factories/projects/make-publish-project-use-case'
import { makeSearchPostsByProfessorNameUseCase } from '@/interface/factories/projects/make-search-posts-by-professor-name-use-case'
import { makeSearchPostsByTagUseCase } from '@/interface/factories/projects/make-search-posts-by-tag-use-case'
import { makeSearchPostsByTitleUseCase } from '@/interface/factories/projects/make-search-posts-by-title-use-case'
import { makeUploadProjectBannerUseCase } from '@/interface/factories/projects/make-upload-project-banner-use-case'
import { PostPresenter } from '@/interface/http/presenters/post'
import { ProjectDetailsPresenter } from '@/interface/http/presenters/project-details'
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard'
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
    const fetchPostsUseCase = makeFetchPostsUseCase()

    const result = await fetchPostsUseCase.execute()

    return {
      posts: result.map(PostPresenter.toHTTP),
    }
  }

  @Get('posts/search')
  @ApiOperation({ summary: 'Search/Filter posts' })
  @ApiResponse({ status: 200, description: 'Posts retrieved successfully' })
  async filterPosts(@Query() filter: FilterPostsDto) {
    let posts: any[] = []

    if (filter.query) {
      const filterPostsUseCase = makeFilterPostsByQueryUseCase()

      const result = await filterPostsUseCase.execute({ query: filter.query })

      if (result.isRight()) {
        posts = result.value
      }
    } else if (filter.title) {
      const searchUseCase = makeSearchPostsByTitleUseCase()
      const result = await searchUseCase.execute({ title: filter.title })
      posts = result
    } else if (filter.professor) {
      const searchUseCase = makeSearchPostsByProfessorNameUseCase()
      const result = await searchUseCase.execute({
        professorName: filter.professor,
      })
      posts = result
    } else if (filter.tag) {
      const searchUseCase = makeSearchPostsByTagUseCase()
      const result = await searchUseCase.execute({ tag: filter.tag })
      posts = result
    } else {
      const fetchPostsUseCase = makeFetchPostsUseCase()
      const result = await fetchPostsUseCase.execute()
      if (result.isRight()) {
        posts = result.value
      }
    }

    return {
      posts: posts.map(PostPresenter.toHTTP),
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
