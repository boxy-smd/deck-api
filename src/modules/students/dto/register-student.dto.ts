import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsEmail, IsNumber, IsArray, IsUUID, IsOptional, MinLength, Min, Max, Matches } from 'class-validator'

export class RegisterStudentDto {
  @ApiProperty({ description: 'Student name', example: 'João Silva' })
  @IsString()
  name: string

  @ApiProperty({ description: 'Student username', example: 'joaosilva', minLength: 3 })
  @IsString()
  @MinLength(3, { message: 'Username must have at least 3 characters.' })
  username: string

  @ApiProperty({ description: 'Student academic email', example: 'joao@alu.ufc.br' })
  @IsEmail({}, { message: 'Invalid email.' })
  @Matches(/@alu\.ufc\.br$/, { message: 'Invalid email. Must be an academic email.' })
  email: string

  @ApiProperty({ description: 'Student password', example: 'senha123', minLength: 6 })
  @IsString()
  @MinLength(6, { message: 'Password must have at least 6 characters.' })
  password: string

  @ApiProperty({ description: 'Student semester', example: 5, minimum: 1, maximum: 12 })
  @IsNumber()
  @Min(1, { message: 'Invalid semester.' })
  @Max(12, { message: 'Invalid semester.' })
  semester: number

  @ApiProperty({ description: 'Trail IDs', example: ['uuid-1', 'uuid-2'], type: [String] })
  @IsArray()
  @IsUUID('4', { each: true, message: 'Invalid trail id.' })
  trailsIds: string[]

  @ApiProperty({ description: 'About the student', required: false, example: 'Passionate about web development' })
  @IsOptional()
  @IsString()
  about?: string

  @ApiProperty({ description: 'Profile URL', required: false, example: 'https://example.com/profile.jpg' })
  @IsOptional()
  @IsString()
  profileUrl?: string
}
