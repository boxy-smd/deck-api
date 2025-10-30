import type { FetchSubjectsUseCase } from '@/@core/application/projects/application/use-cases/fetch-subjects'
import { SubjectPresenter } from '@/@presentation/presenters/subject'
import { Controller, Get, Query } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import type { FetchSubjectsDto } from '../dto/fetch-subjects.dto'
import { SubjectsListResponseDto } from '../dto/subjects-response.dto'

@ApiTags('Disciplinas')
@Controller()
export class SubjectsController {
  constructor(private readonly fetchSubjectsUseCase: FetchSubjectsUseCase) {}

  @Get('subjects')
  @ApiOperation({
    summary: 'Listar disciplinas',
    description:
      'Retorna lista de disciplinas cadastradas. Permite filtro por nome.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de disciplinas retornada com sucesso.',
    type: SubjectsListResponseDto,
  })
  async fetchSubjects(
    @Query() query: FetchSubjectsDto,
  ): Promise<SubjectsListResponseDto> {
    const result = await this.fetchSubjectsUseCase.execute({
      name: query.name,
    })

    return {
      subjects: result.map(SubjectPresenter.toHTTP),
    }
  }
}
