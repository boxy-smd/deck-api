import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator'

export class EditProfileDto {
  @ApiProperty({
    description: 'Sobre o estudante',
    required: false,
    example: 'Estudante de Engenharia de Software na UFC.',
  })
  @IsOptional()
  @IsString()
  about?: string

  @ApiProperty({
    description: 'Semestre do estudante',
    required: false,
    example: 6,
  })
  @IsOptional()
  @IsNumber()
  semester?: number

  @ApiProperty({
    description: 'URL do perfil',
    required: false,
    example: 'https://example.com/profile.jpg',
  })
  @IsOptional()
  @IsUrl()
  profileUrl?: string

  @ApiProperty({
    description: 'IDs das trilhas',
    required: false,
    type: [String],
    example: ['uuid-1', 'uuid-2'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  trailsIds?: string[]
}
