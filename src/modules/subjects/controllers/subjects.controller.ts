import { makeFetchSubjectsUseCase } from '@/interface/factories/subjects/make-fetch-subjects-use-case'
import { SubjectPresenter } from '@/interface/http/presenters/subject'
import { Controller, Get, Query } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import type { FetchSubjectsDto } from '../dto/fetch-subjects.dto'

@ApiTags('Subjects')
@Controller()
export class SubjectsController {
  @Get('subjects')
  @ApiOperation({ summary: 'Fetch subjects' })
  @ApiResponse({ status: 200, description: 'Subjects retrieved successfully' })
  async fetchSubjects(@Query() query: FetchSubjectsDto) {
    const fetchSubjectsUseCase = makeFetchSubjectsUseCase()

    const result = await fetchSubjectsUseCase.execute({
      name: query.name,
    })

    return {
      subjects: result.map(SubjectPresenter.toHTTP),
    }
  }
}
