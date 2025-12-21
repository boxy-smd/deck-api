import { ApiProperty } from '@nestjs/swagger'

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
