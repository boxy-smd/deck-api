import { ApiProperty } from '@nestjs/swagger'
import {
  IsArray,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  Min,
  MinLength,
} from 'class-validator'

export class RegisterStudentDto {
  @ApiProperty({ description: 'Nome do estudante', example: 'João Silva' })
  @IsString()
  name: string

  @ApiProperty({
    description: 'Nome de usuário do estudante',
    example: 'joaosilva',
    minLength: 3,
  })
  @IsString()
  @MinLength(3, {
    message: 'Nome de usuário deve ter pelo menos 3 caracteres.',
  })
  username: string

  @ApiProperty({
    description: 'Email acadêmico do estudante',
    example: 'joao@alu.ufc.br',
  })
  @IsEmail({}, { message: 'Email inválido.' })
  @Matches(/@alu\.ufc\.br$/, {
    message: 'Email inválido. Deve ser um email acadêmico.',
  })
  email: string

  @ApiProperty({
    description: 'Senha do estudante',
    example: 'senha123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres.' })
  password: string

  @ApiProperty({
    description: 'Semestre do estudante',
    example: 5,
    minimum: 1,
    maximum: 12,
  })
  @IsNumber()
  @Min(1, { message: 'Semestre inválido.' })
  @Max(12, { message: 'Semestre inválido.' })
  semester: number

  @ApiProperty({
    description: 'IDs das trilhas',
    example: ['uuid-1', 'uuid-2'],
    type: [String],
  })
  @IsArray()
  @IsUUID('4', { each: true, message: 'ID de trilha inválido.' })
  trailsIds: string[]

  @ApiProperty({
    description: 'Sobre o estudante',
    required: false,
    example: 'Estudante de Engenharia de Software na UFC.',
  })
  @IsOptional()
  @IsString()
  about?: string

  @ApiProperty({
    description: 'URL do perfil',
    required: false,
    example: 'https://example.com/profile.jpg',
  })
  @IsOptional()
  @IsString()
  profileUrl?: string
}
