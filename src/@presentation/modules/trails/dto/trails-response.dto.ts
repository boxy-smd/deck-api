import { ApiProperty } from '@nestjs/swagger'

export class TrailResponseDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string
}

export class TrailsListResponseDto {
  @ApiProperty({ type: [TrailResponseDto] })
  trails: TrailResponseDto[]
}
