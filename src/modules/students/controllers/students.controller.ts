import { makeGetProfileUseCase } from '@/interface/factories/students/make-get-profile-use-case'
import { makeLoginUseCase } from '@/interface/factories/students/make-login-use-case'
import { makeRegisterUseCase } from '@/interface/factories/students/make-register-use-case'
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common'
import type { JwtService } from '@nestjs/jwt'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import type { LoginStudentDto } from '../dto/login-student.dto'
import type { RegisterStudentDto } from '../dto/register-student.dto'

@ApiTags('Students')
@Controller()
export class StudentsController {
  constructor(private jwtService: JwtService) {}

  @Post('students')
  @ApiOperation({ summary: 'Register a new student' })
  @ApiResponse({ status: 201, description: 'Student registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Student already exists' })
  async register(@Body() registerDto: RegisterStudentDto) {
    const registerUseCase = makeRegisterUseCase()

    const result = await registerUseCase.execute({
      name: registerDto.name,
      username: registerDto.username,
      email: registerDto.email,
      password: registerDto.password,
      semester: registerDto.semester,
      about: registerDto.about,
      profileUrl: registerDto.profileUrl,
      trailsIds: registerDto.trailsIds,
    })

    if (result.isLeft()) {
      const error = result.value
      throw new Error(error.message)
    }

    return { user_id: result.value.id.toString() }
  }

  @Post('sessions')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login student' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginStudentDto) {
    const loginUseCase = makeLoginUseCase()

    const result = await loginUseCase.execute({
      email: loginDto.email,
      password: loginDto.password,
    })

    if (result.isLeft()) {
      const error = result.value
      throw new Error(error.message)
    }

    const token = this.jwtService.sign({
      sub: result.value.id,
      role: 'student',
    })

    return { token }
  }

  @Get('profiles/:username')
  @ApiOperation({ summary: 'Get student profile by username' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async getProfile(@Param('username') username: string) {
    const getProfileUseCase = makeGetProfileUseCase()

    const result = await getProfileUseCase.execute({ username })

    if (result.isLeft()) {
      const error = result.value
      throw new Error(error.message)
    }

    return result.value
  }
}
