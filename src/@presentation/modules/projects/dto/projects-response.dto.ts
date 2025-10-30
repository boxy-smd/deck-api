import { ApiProperty } from '@nestjs/swagger'

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
  createdAt: Date

  @ApiProperty()
  author: {
    id: string
    name: string
    username: string
  }

  @ApiProperty()
  subject: {
    id: string
    name: string
  }

  @ApiProperty({ type: [Object] })
  trails: Array<{
    id: string
    name: string
  }>
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

  @ApiProperty()
  author: {
    id: string
    name: string
    username: string
    profileUrl?: string
  }

  @ApiProperty()
  subject: {
    id: string
    name: string
  }

  @ApiProperty({ type: [Object] })
  trails: Array<{
    id: string
    name: string
  }>

  @ApiProperty({ type: [Object] })
  professors: Array<{
    id: string
    name: string
  }>
}
