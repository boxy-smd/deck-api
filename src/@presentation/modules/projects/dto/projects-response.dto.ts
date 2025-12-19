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

export class AuthorDTO {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  username: string

  @ApiProperty({ required: false })
  profileUrl?: string
}

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

  @ApiProperty({ type: AuthorDTO })
  author: AuthorDTO

  @ApiProperty({ type: SubjectDTO, required: false })
  subject?: SubjectDTO

  @ApiProperty({ type: [TrailDTO] })
  trails: TrailDTO[]

  @ApiProperty({ type: [ProfessorDTO] })
  professors: ProfessorDTO[]
}
