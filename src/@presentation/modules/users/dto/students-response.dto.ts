import { UserRole } from '@/@core/domain/users/value-objects/user-role'
import { UserStatus } from '@/@core/domain/users/value-objects/user-status'
import { ApiProperty } from '@nestjs/swagger'
import { ProjectSummaryResponseDto } from '../../projects/dto/projects-response.dto'

export class UserIdResponseDto {
  @ApiProperty()
  user_id: string
}

export class UserResponseDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  username: string

  @ApiProperty()
  email: string

  @ApiProperty({ required: false })
  semester?: number

  @ApiProperty({ required: false })
  about?: string

  @ApiProperty({ required: false })
  profileUrl?: string

  @ApiProperty({ type: [String] })
  trails: string[]

  @ApiProperty({ enum: UserRole })
  role: UserRole

  @ApiProperty({ enum: UserStatus })
  status: UserStatus

  @ApiProperty({ type: [ProjectSummaryResponseDto] })
  posts: ProjectSummaryResponseDto[]

  @ApiProperty({ type: [ProjectSummaryResponseDto] })
  drafts: ProjectSummaryResponseDto[]
}

export class TokenResponseDto {
  @ApiProperty()
  token: string

  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto
}

export class UserSummaryResponseDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  username: string

  @ApiProperty({ required: false })
  semester?: number

  @ApiProperty({ required: false })
  about?: string

  @ApiProperty({ required: false })
  profileUrl?: string

  @ApiProperty({ type: [String] })
  trails: string[]

  @ApiProperty({ enum: UserRole })
  role: UserRole
}

export class UsersListResponseDto {
  @ApiProperty({ type: [UserSummaryResponseDto] })
  users: UserSummaryResponseDto[]
}

export class ProfileUpdateResponseDto {
  @ApiProperty({ type: UserResponseDto })
  profile: UserResponseDto
}

export class MessageResponseDto {
  @ApiProperty()
  message: string
}
