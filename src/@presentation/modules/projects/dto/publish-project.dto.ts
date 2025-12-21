import { ApiProperty } from '@nestjs/swagger'
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
  Max,
  Min,
  MinLength,
} from 'class-validator'

export class PublishProjectDto {
  @ApiProperty({
    description: 'Título do projeto',
    example: 'Meu Projeto Incrível',
    minLength: 3,
  })
  @IsString()
  @MinLength(3, { message: 'O título deve ter pelo menos 3 caracteres.' })
  title: string

  @ApiProperty({
    description: 'Descrição detalhada',
    example: 'Uma descrição detalhada do meu projeto incrível.',
  })
  @IsString()
  description: string

  @ApiProperty({
    description: 'URL do banner do projeto',
    required: false,
    example: 'https://example.com/banner.jpg',
  })
  @IsOptional()
  @IsUrl()
  bannerUrl?: string

  @ApiProperty({ description: 'Conteúdo do projeto', required: false })
  @IsOptional()
  @IsString()
  content?: string

  @ApiProperty({
    description: 'Ano de publicação',
    example: 2024,
    minimum: 2000,
  })
  @IsNumber()
  @Min(2000)
  @Max(new Date().getFullYear())
  publishedYear: number

  @ApiProperty({ description: 'Semestre', example: 5, minimum: 1, maximum: 12 })
  @IsNumber()
  @Min(1, { message: 'O semestre deve estar entre 1 e 12.' })
  @Max(12, { message: 'O semestre deve estar entre 1 e 12.' })
  semester: number

  @ApiProperty({
    description: 'Permitir comentários',
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  allowComments?: boolean

  @ApiProperty({
    description: 'ID da disciplina',
    required: false,
    example: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  subjectId?: string

  @ApiProperty({
    description: 'IDs das trilhas',
    type: [String],
    example: ['uuid1', 'uuid2'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true, message: 'ID da trilha inválido.' })
  trailsIds?: string[]

  @ApiProperty({
    description: 'IDs dos professores',
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true, message: 'ID do professor inválido.' })
  professorsIds?: string[]

  @ApiProperty({
    description: 'ID do rascunho',
    required: false,
    example: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  draftId?: string
}
