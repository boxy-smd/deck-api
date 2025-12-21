import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class FetchProfessorsDto {
  @ApiProperty({
    description: 'Filtro por nome do professor',
    required: false,
    example: 'Maria',
  })
  @IsOptional()
  @IsString()
  name?: string
}
