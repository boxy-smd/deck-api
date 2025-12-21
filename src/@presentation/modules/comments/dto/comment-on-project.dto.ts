import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, Matches } from 'class-validator'

export class CommentOnProjectDto {
  @ApiProperty({
    description: 'Conteúdo do comentário',
    example: 'Ótimo projeto!',
  })
  @IsString()
  @IsNotEmpty({ message: 'O conteúdo do comentário não pode estar vazio' })
  @Matches(/^.+$/, { message: 'O conteúdo do comentário não pode estar vazio' })
  content: string
}
