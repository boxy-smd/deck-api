import { FetchSubjectsUseCase } from '@/@core/domain/projects/application/use-cases/fetch-subjects'
import { SubjectPresenter } from '@/@presentation/presenters/subject'
import { Controller, Get, Query } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import type { FetchSubjectsDto } from '../dto/fetch-subjects.dto'
import { SubjectsListResponseDto } from '../dto/subjects-response.dto'

@ApiTags('Subjects')
@Controller()
export class SubjectsController {
  constructor(private readonly fetchSubjectsUseCase: FetchSubjectsUseCase) {}

  @Get('subjects')
  @ApiOperation({ summary: 'Fetch subjects' })
  @ApiResponse({
    status: 200,
    description: 'Subjects retrieved successfully',
    type: SubjectsListResponseDto,
  })
  async fetchSubjects(@Query() query: FetchSubjectsDto): Promise<SubjectsListResponseDto> {
    const result = await this.fetchSubjectsUseCase.execute({
      name: query.name,
    })

    return {
      subjects: result.map(SubjectPresenter.toHTTP),
    }
  }
}
