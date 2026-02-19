import { ApiProperty } from '@nestjs/swagger'
import { CommentResponseDto } from '../../comments/dto/comments-response.dto'

export class PaginationResponseDto {
  @ApiProperty()
  page: number

  @ApiProperty()
  perPage: number

  @ApiProperty()
  total: number

  @ApiProperty()
  totalPages: number
}

import { AuthorDTO } from './author.dto'

export class SubjectDTO {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string
}

export class TrailDTO {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string
}

export class ProfessorDTO {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string
}

export class ProjectSummaryResponseDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  title: string

  @ApiProperty()
  description: string

  @ApiProperty({ required: false })
  bannerUrl?: string

  @ApiProperty()
  publishedYear: number

  @ApiProperty()
  semester: number

  @ApiProperty()
  allowComments: boolean

  @ApiProperty()
  createdAt: Date

  @ApiProperty({ required: false })
  updatedAt?: Date

  @ApiProperty({ required: false })
  subjectId?: string

  @ApiProperty({ type: [String] })
  trailsIds: string[]

  @ApiProperty({ type: [String] })
  professorsIds: string[]

  @ApiProperty({ type: AuthorDTO })
  author: AuthorDTO

  @ApiProperty({ type: SubjectDTO, required: false })
  subject?: SubjectDTO

  @ApiProperty({ type: [TrailDTO] })
  trails: TrailDTO[]

  @ApiProperty({ type: [ProfessorDTO] })
  professors: ProfessorDTO[]
}

export class ProjectsListResponseDto {
  @ApiProperty({ type: [ProjectSummaryResponseDto] })
  posts: ProjectSummaryResponseDto[]

  @ApiProperty({ type: PaginationResponseDto })
  pagination: PaginationResponseDto
}

export class PublishProjectResponseDto {
  @ApiProperty()
  project_id: string
}

export class UploadResponseDto {
  @ApiProperty()
  message: string
}

export class RichTextImageUploadResponseDto {
  @ApiProperty({
    description:
      'URL pública da imagem enviada para uso no editor de texto rico.',
    example: 'https://cdn.example.com/rich-text/123/4b8d7c1a.png',
  })
  url: string
}

export class ProjectDetailsResponseDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  title: string

  @ApiProperty()
  description: string

  @ApiProperty({ required: false })
  bannerUrl?: string

  @ApiProperty()
  content: string

  @ApiProperty()
  publishedYear: number

  @ApiProperty()
  semester: number

  @ApiProperty()
  allowComments: boolean

  @ApiProperty()
  createdAt: Date

  @ApiProperty({ required: false })
  updatedAt?: Date

  @ApiProperty({ required: false })
  subjectId?: string

  @ApiProperty({ type: [String] })
  trailsIds: string[]

  @ApiProperty({ type: [String] })
  professorsIds: string[]

  @ApiProperty({ type: AuthorDTO })
  author: AuthorDTO

  @ApiProperty({ type: SubjectDTO, required: false })
  subject?: SubjectDTO

  @ApiProperty({ type: [TrailDTO] })
  trails: TrailDTO[]

  @ApiProperty({ type: [ProfessorDTO] })
  professors: ProfessorDTO[]

  @ApiProperty({ type: [CommentResponseDto] })
  comments: CommentResponseDto[]
}
