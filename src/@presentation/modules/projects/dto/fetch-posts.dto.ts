import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsInt, IsOptional, IsString } from 'class-validator'

export class FetchPostsDto {
  @ApiProperty({
    description: 'Filtro de busca geral',
    required: false,
    example: 'web',
  })
  @IsOptional()
  @IsString()
  query?: string
}

export class FilterPostsDto {
  @ApiProperty({
    description: 'Filtro por ID da disciplina',
    required: false,
    example: 'uuid',
  })
  @IsOptional()
  @IsString()
  subjectId?: string

  @ApiProperty({
    description: 'Filtro por IDs das trilhas',
    required: false,
    type: [String],
    example: ['uuid1', 'uuid2'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  trailsIds?: string[]

  @ApiProperty({
    description: 'Filtro por nome do professor',
    required: false,
    example: 'Maria',
  })
  @IsOptional()
  @IsString()
  professorName?: string

  @ApiProperty({
    description: 'Filtro por tags',
    required: false,
    type: [String],
    example: ['react', 'typescript'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[]

  @ApiProperty({
    description: 'Pesquisa por título do post',
    required: false,
    example: 'website',
  })
  @IsOptional()
  @IsString()
  title?: string

  @ApiProperty({
    description: 'Filtro por semestre',
    required: false,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  semester?: number

  @ApiProperty({
    description: 'Filtro por ano de publicação',
    required: false,
    example: 2024,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  publishedYear?: number
}
