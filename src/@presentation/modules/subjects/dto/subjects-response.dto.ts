import { ApiProperty } from '@nestjs/swagger'

export class SubjectResponseDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string
}

export class SubjectsListResponseDto {
  @ApiProperty({ type: [SubjectResponseDto] })
  subjects: SubjectResponseDto[]
}
