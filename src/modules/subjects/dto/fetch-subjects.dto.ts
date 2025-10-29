import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class FetchSubjectsDto {
  @ApiProperty({
    description: 'Filtro por nome da disciplina',
    required: false,
    example: 'Programação',
  })
  @IsOptional()
  @IsString()
  name?: string
}
