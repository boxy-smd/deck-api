import { DeleteProjectUseCase } from '@/@core/application/projects/use-cases/delete-project'
import { GetProjectUseCase } from '@/@core/application/projects/use-cases/get-project'
import { ListDraftsUseCase } from '@/@core/application/projects/use-cases/list-drafts'
import { PublishProjectUseCase } from '@/@core/application/projects/use-cases/publish-project'
import { SaveDraftUseCase } from '@/@core/application/projects/use-cases/save-draft'
import { SearchProjectsUseCase } from '@/@core/application/projects/use-cases/search-projects'
import { UploadProjectBannerUseCase } from '@/@core/application/projects/use-cases/upload-project-banner'
import { Public } from '@/@presentation/modules/auth/decorators/public.decorator'
import { JwtAuthGuard } from '@/@presentation/modules/auth/guards/jwt-auth.guard'
import { ProjectPresenter } from '@/@presentation/presenters/project'
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

@ApiTags('Projetos')
@Controller()
export class ProjectsController {
  constructor(
    private readonly publishProjectUseCase: PublishProjectUseCase,
    private readonly saveDraftUseCase: SaveDraftUseCase,
    private readonly listDraftsUseCase: ListDraftsUseCase,
    private readonly searchProjectsUseCase: SearchProjectsUseCase,
    private readonly getProjectUseCase: GetProjectUseCase,
    private readonly deleteProjectUseCase: DeleteProjectUseCase,
    private readonly uploadProjectBannerUseCase: UploadProjectBannerUseCase,
  ) {}

  @Post('projects/drafts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Salvar rascunho',
    description:
      'Salva um projeto como rascunho. Pode ser usado para criar um novo rascunho ou atualizar um existente.',
  })
  @ApiResponse({
    status: 201,
    description: 'Rascunho salvo com sucesso.',
  })
  async saveDraft(
    @Body() dto: PublishProjectDto,
    @Request() req: { user: { userId: string } },
  ) {
    const result = await this.saveDraftUseCase.execute({
      title: dto.title,
      description: dto.description,
      bannerUrl: dto.bannerUrl,
      content: dto.content,
      publishedYear: dto.publishedYear,
      semester: dto.semester,
      allowComments: dto.allowComments ?? true,
      authorId: req.user.userId,
      subjectId: dto.subjectId,
      trailsIds: dto.trailsIds ?? [],
      professorsIds: dto.professorsIds,
      draftId: dto.draftId,
    })

    if (result.isLeft()) {
      const error = result.value
      if (error.statusCode === 404) {
        throw new NotFoundException(error.message)
      }
      throw new BadRequestException(error.message)
    }

    return {
      project_id: result.value.projectId,
    }
  }

  @Get('projects/drafts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Listar rascunhos',
    description: 'Lista todos os rascunhos do usuário autenticado.',
  })
  async listDrafts(@Request() req: { user: { userId: string } }) {
    const result = await this.listDraftsUseCase.execute({
      authorId: req.user.userId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return {
      drafts: result.value.drafts.map(ProjectPresenter.toHTTP),
    }
  }

  @Post('projects')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Publicar projeto',
    description:
      'Publica um novo projeto na plataforma com todas as informações necessárias incluindo disciplina, trilhas e professores.',
  })
  @ApiResponse({
    status: 201,
    description: 'Projeto publicado com sucesso.',
    type: PublishProjectResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos. Verifique todos os campos obrigatórios.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Recurso não encontrado. Disciplina, trilha ou professor inválido.',
  })
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
      allowComments: dto.allowComments ?? true,
      authorId: req.user.userId,
      subjectId: dto.subjectId,
      trailsIds: dto.trailsIds || [],
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

  @Public()
  @Get('posts')
  @ApiOperation({
    summary: 'Listar publicações',
    description:
      'Retorna uma lista paginada de projetos publicados. Suporta busca geral por query.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de publicações retornada com sucesso.',
    type: ProjectsListResponseDto,
  })
  async fetchPosts(
    @Query() query: FetchPostsDto,
  ): Promise<ProjectsListResponseDto> {
    const result = await this.searchProjectsUseCase.execute({
      query: query.query,
      page: query.page,
      perPage: query.perPage,
    })

    if (result.isLeft()) {
      throw new BadRequestException('Falha ao buscar publicações.')
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

  @Public()
  @Get('posts/search')
  @ApiOperation({
    summary: 'Buscar e filtrar publicações',
    description:
      'Busca projetos com filtros avançados: título, professor, tags, disciplina, trilhas, semestre e ano. Suporta paginação.',
  })
  @ApiResponse({
    status: 200,
    description: 'Resultados da busca retornados com sucesso.',
    type: ProjectsListResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Parâmetros de filtro inválidos.',
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
      authorId: filter.authorId,
      page: filter.page,
      perPage: filter.perPage,
    })

    if (result.isLeft()) {
      throw new BadRequestException('Falha ao buscar projetos.')
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

  @Public()
  @Get('projects/:projectId')
  @ApiOperation({
    summary: 'Buscar detalhes do projeto',
    description:
      'Retorna informações completas de um projeto específico incluindo conteúdo, autores, disciplina e trilhas.',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalhes do projeto retornados com sucesso.',
    type: ProjectDetailsResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Projeto não encontrado.',
  })
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
  @ApiOperation({
    summary: 'Excluir projeto',
    description:
      'Remove um projeto da plataforma. Apenas o autor do projeto pode excluí-lo.',
  })
  @ApiResponse({
    status: 204,
    description: 'Projeto excluído com sucesso.',
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado. Apenas o autor pode excluir o projeto.',
  })
  @ApiResponse({
    status: 404,
    description: 'Projeto não encontrado.',
  })
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
  @ApiOperation({
    summary: 'Fazer upload do banner do projeto',
    description:
      'Envia uma imagem para ser usada como banner/capa do projeto. Formatos aceitos: JPG, PNG. Tamanho máximo: 5MB.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Arquivo de imagem (JPG ou PNG)',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Banner enviado com sucesso.',
    type: UploadResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Arquivo inválido ou não fornecido.',
  })
  @ApiResponse({
    status: 404,
    description: 'Projeto não encontrado.',
  })
  async uploadBanner(
    @Param('projectId') projectId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadResponseDto> {
    if (!file) {
      throw new BadRequestException('É necessário enviar um arquivo de imagem.')
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

    return { message: 'Banner enviado com sucesso.' }
  }
}
