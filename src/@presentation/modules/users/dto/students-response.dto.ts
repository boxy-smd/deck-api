import { ApiProperty } from '@nestjs/swagger'

export class UserIdResponseDto {
  @ApiProperty()
  user_id: string
}

export class TokenResponseDto {
  @ApiProperty()
  token: string
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

  @ApiProperty()
  role: string

  @ApiProperty()
  status: string
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

  @ApiProperty()
  role: string
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
