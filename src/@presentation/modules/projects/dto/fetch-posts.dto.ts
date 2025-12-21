import { ApiProperty } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import { IsArray, IsInt, IsOptional, IsString, Min } from 'class-validator'

export class FetchPostsDto {
  @ApiProperty({
    description: 'Filtro de busca geral',
    required: false,
    example: 'web',
  })
  @IsOptional()
  @IsString()
  query?: string

  @ApiProperty({
    description: 'Número da página (começa em 1)',
    required: false,
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number

  @ApiProperty({
    description: 'Quantidade de itens por página',
    required: false,
    example: 10,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  perPage?: number
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
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
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
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
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

  @ApiProperty({
    description: 'Filtro por ID do autor',
    required: false,
    example: 'uuid',
  })
  @IsOptional()
  @IsString()
  authorId?: string

  @ApiProperty({
    description: 'Número da página (começa em 1)',
    required: false,
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number

  @ApiProperty({
    description: 'Quantidade de itens por página',
    required: false,
    example: 10,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  perPage?: number
}
