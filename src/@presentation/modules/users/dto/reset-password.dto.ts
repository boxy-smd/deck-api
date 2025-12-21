import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, MinLength } from 'class-validator'

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Token de recuperação de senha recebido por email',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @IsNotEmpty({ message: 'O token é obrigatório.' })
  token: string

  @ApiProperty({
    description: 'Nova senha do usuário',
    example: 'newpassword123',
    minLength: 6,
  })
  @IsNotEmpty({ message: 'A nova senha é obrigatória.' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  newPassword: string
}
