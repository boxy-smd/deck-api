import { FetchTrailsUseCase } from '@/@core/domain/projects/application/use-cases/fetch-trails'
import { TrailPresenter } from '@/@presentation/presenters/trail'
import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { TrailsListResponseDto } from '../dto/trails-response.dto'

@ApiTags('Trails')
@Controller()
export class TrailsController {
  constructor(private readonly fetchTrailsUseCase: FetchTrailsUseCase) {}

  @Get('trails')
  @ApiOperation({ summary: 'Fetch trails' })
  @ApiResponse({
    status: 200,
    description: 'Trails retrieved successfully',
    type: TrailsListResponseDto,
  })
  async fetchTrails(): Promise<TrailsListResponseDto> {
    const result = await this.fetchTrailsUseCase.execute()

    return {
      trails: result.map(TrailPresenter.toHTTP),
    }
  }
}
