import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsEmail, MinLength } from 'class-validator'

export class LoginStudentDto {
  @ApiProperty({ description: 'Student email', example: 'joao@alu.ufc.br' })
  @IsEmail({}, { message: 'Invalid email.' })
  email: string

  @ApiProperty({ description: 'Student password', example: 'senha123' })
  @IsString()
  @MinLength(6, { message: 'Password must have at least 6 characters.' })
  password: string
}
