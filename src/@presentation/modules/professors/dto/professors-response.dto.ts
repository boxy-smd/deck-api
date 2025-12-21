import { ApiProperty } from '@nestjs/swagger'

export class ProfessorResponseDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string
}

export class ProfessorsListResponseDto {
  @ApiProperty({ type: [ProfessorResponseDto] })
  professors: ProfessorResponseDto[]
}
