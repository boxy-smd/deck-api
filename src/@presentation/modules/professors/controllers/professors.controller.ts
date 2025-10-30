import type { FetchProfessorsUseCase } from '@/@core/application/projects/application/use-cases/fetch-professors'
import { ProfessorPresenter } from '@/@presentation/presenters/professor'
import { Controller, Get, Query } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import type { FetchProfessorsDto } from '../dto/fetch-professors.dto'
import { ProfessorsListResponseDto } from '../dto/professors-response.dto'

@ApiTags('Professores')
@Controller()
export class ProfessorsController {
  constructor(
    private readonly fetchProfessorsUseCase: FetchProfessorsUseCase,
  ) {}

  @Get('professors')
  @ApiOperation({
    summary: 'Listar professores',
    description:
      'Retorna lista de professores cadastrados. Permite filtro por nome.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de professores retornada com sucesso.',
    type: ProfessorsListResponseDto,
  })
  async fetchProfessors(
    @Query() query: FetchProfessorsDto,
  ): Promise<ProfessorsListResponseDto> {
    const result = await this.fetchProfessorsUseCase.execute({
      name: query.name,
    })

    return {
      professors: result.map(ProfessorPresenter.toHTTP),
    }
  }
}
