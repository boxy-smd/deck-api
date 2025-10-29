import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class FetchStudentsDto {
  @ApiProperty({
    description: 'Nome do estudante para filtro de busca',
    required: false,
    example: 'João',
  })
  @IsOptional()
  @IsString()
  name?: string
}
