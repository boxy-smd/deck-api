import { makeFetchTrailsUseCase } from '@/@core/application/factories/trails/make-fetch-trails-use-case'
import { TrailPresenter } from '@/@presentation/presenters/trail'
import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('Trails')
@Controller()
export class TrailsController {
  @Get('trails')
  @ApiOperation({ summary: 'Fetch trails' })
  @ApiResponse({ status: 200, description: 'Trails retrieved successfully' })
  async fetchTrails() {
    const fetchTrailsUseCase = makeFetchTrailsUseCase()

    const result = await fetchTrailsUseCase.execute()

    return {
      trails: result.map(TrailPresenter.toHTTP),
    }
  }
}
