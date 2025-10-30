import { ApiProperty } from '@nestjs/swagger'

export class StudentResponseDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  username: string

  @ApiProperty({ required: false })
  profileUrl?: string
}

export class StudentsListResponseDto {
  @ApiProperty({ type: [StudentResponseDto] })
  students: StudentResponseDto[]
}

export class UserIdResponseDto {
  @ApiProperty()
  user_id: string
}

export class TokenResponseDto {
  @ApiProperty()
  token: string
}

export class StudentProfileResponseDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  username: string

  @ApiProperty()
  email: string

  @ApiProperty()
  semester: number

  @ApiProperty({ required: false })
  about?: string

  @ApiProperty({ required: false })
  profileUrl?: string

  @ApiProperty({ type: [Object] })
  trails: Array<{
    id: string
    name: string
  }>

  @ApiProperty()
  createdAt: Date
}

export class ProfileUpdateResponseDto {
  @ApiProperty({ type: StudentProfileResponseDto })
  profile: StudentProfileResponseDto
}

export class MessageResponseDto {
  @ApiProperty()
  message: string
}
