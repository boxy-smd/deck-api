import { makeFetchProfessorsUseCase } from '@/@core/application/factories/professors/make-fetch-professors-use-case'
import { ProfessorPresenter } from '@/@presentation/presenters/professor'
import { Controller, Get, Query } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import type { FetchProfessorsDto } from '../dto/fetch-professors.dto'

@ApiTags('Professors')
@Controller()
export class ProfessorsController {
  @Get('professors')
  @ApiOperation({ summary: 'Fetch professors' })
  @ApiResponse({
    status: 200,
    description: 'Professors retrieved successfully',
  })
  async fetchProfessors(@Query() query: FetchProfessorsDto) {
    const fetchProfessorsUseCase = makeFetchProfessorsUseCase()

    const result = await fetchProfessorsUseCase.execute({
      name: query.name,
    })

    return {
      professors: result.map(ProfessorPresenter.toHTTP),
    }
  }
}
