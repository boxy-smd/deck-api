import { FetchTrailsUseCase } from '@/@core/application/trails/use-cases/fetch-trails'
import { Public } from '@/@presentation/modules/auth/decorators/public.decorator'
import { TrailPresenter } from '@/@presentation/presenters/trail'
import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { TrailsListResponseDto } from '../dto/trails-response.dto'

@ApiTags('Trilhas')
@Controller()
export class TrailsController {
  constructor(private readonly fetchTrailsUseCase: FetchTrailsUseCase) {}

  @Public()

  @Get('trails')
  @ApiOperation({
    summary: 'Listar trilhas',
    description:
      'Retorna todas as trilhas de aprendizagem disponíveis na plataforma.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de trilhas retornada com sucesso.',
    type: TrailsListResponseDto,
  })
  async fetchTrails(): Promise<TrailsListResponseDto> {
    const result = await this.fetchTrailsUseCase.execute()

    return {
      trails: result.map(TrailPresenter.toHTTP),
    }
  }
}
