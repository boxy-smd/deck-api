import { ApiProperty } from '@nestjs/swagger'
import { AuthorDTO } from '../../projects/dto/author.dto'

export class CommentResponseDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  content: string

  @ApiProperty()
  createdAt: Date

  @ApiProperty({ type: AuthorDTO })
  author: AuthorDTO
}

export class CommentsListResponseDto {
  @ApiProperty({ type: [CommentResponseDto] })
  comments: CommentResponseDto[]
}

export class CommentCreatedResponseDto {
  @ApiProperty()
  comment_id: string
}

export class MessageResponseDto {
  @ApiProperty()
  message: string
}
