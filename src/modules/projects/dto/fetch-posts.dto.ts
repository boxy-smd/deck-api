import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

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
  subject?: string

  @ApiProperty({
    description: 'Filtro por ID da trilha',
    required: false,
    example: 'uuid',
  })
  @IsOptional()
  @IsString()
  trail?: string

  @ApiProperty({
    description: 'Filtro por nome do professor',
    required: false,
    example: 'Maria',
  })
  @IsOptional()
  @IsString()
  professor?: string

  @ApiProperty({
    description: 'Filtro por tag',
    required: false,
    example: 'react',
  })
  @IsOptional()
  @IsString()
  tag?: string

  @ApiProperty({
    description: 'Pesquisa por título do post',
    required: false,
    example: 'website',
  })
  @IsOptional()
  @IsString()
  title?: string
}
