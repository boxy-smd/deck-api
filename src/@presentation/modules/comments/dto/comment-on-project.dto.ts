import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CommentOnProjectDto {
  @ApiProperty({
    description: 'Conteúdo do comentário',
    example: 'Ótimo projeto!',
  })
  @IsString()
  @IsNotEmpty()
  content: string
}
