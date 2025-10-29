import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsUUID } from 'class-validator'

export class ReportCommentDto {
  @ApiProperty({
    description: 'Conteúdo da denúncia',
    example: 'Conteúdo impróprio',
  })
  @IsString()
  @IsNotEmpty()
  content: string

  @ApiProperty({ description: 'ID do projeto', example: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  projectId: string
}
