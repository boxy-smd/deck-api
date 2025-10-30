import { ApiProperty } from '@nestjs/swagger'

export class CommentResponseDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  content: string

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  author: {
    id: string
    name: string
    username: string
    profileUrl?: string
  }
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
