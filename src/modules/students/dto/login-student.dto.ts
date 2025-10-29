import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, MinLength } from 'class-validator'

export class LoginStudentDto {
  @ApiProperty({
    description: 'Email do estudante',
    example: 'joao@alu.ufc.br',
  })
  @IsEmail({}, { message: 'Email inválido.' })
  email: string

  @ApiProperty({ description: 'Senha do estudante', example: '123456' })
  @IsString()
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres.' })
  password: string
}
