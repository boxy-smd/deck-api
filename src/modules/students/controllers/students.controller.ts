import { makeEditProfileUseCase } from '@/interface/factories/students/make-edit-profile-use-case'
import { makeFetchStudentsUseCase } from '@/interface/factories/students/make-fetch-students-use-case'
import { makeGetProfileUseCase } from '@/interface/factories/students/make-get-profile-use-case'
import { makeGetStudentDetailsUseCase } from '@/interface/factories/students/make-get-student-details-use-case'
import { makeLoginUseCase } from '@/interface/factories/students/make-login-use-case'
import { makeRegisterUseCase } from '@/interface/factories/students/make-register-use-case'
import { StudentPresenter } from '@/interface/http/presenters/student'
import { StudentProfilePresenter } from '@/interface/http/presenters/student-profile'
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import type { JwtService } from '@nestjs/jwt'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import type { EditProfileDto } from '../dto/edit-profile.dto'
import type { FetchStudentsDto } from '../dto/fetch-students.dto'
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
      if (error.statusCode === 409) {
        throw new ConflictException(error.message)
      }
      throw new BadRequestException(error.message)
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
      throw new UnauthorizedException(error.message)
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
      if (error.statusCode === 404) {
        throw new NotFoundException(error.message)
      }
      throw new BadRequestException(error.message)
    }

    return StudentProfilePresenter.toHTTP(result.value)
  }

  @Put('profiles/:studentId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Edit student profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async editProfile(
    @Param('studentId') studentId: string,
    @Body() editDto: EditProfileDto,
    @Request() req: any,
  ) {
    if (studentId !== req.user.userId) {
      throw new ForbiddenException('Forbidden.')
    }

    const editProfileUseCase = makeEditProfileUseCase()

    const result = await editProfileUseCase.execute({
      studentId,
      profileUrl: editDto.profileUrl,
      semester: editDto.semester,
      trailsIds: editDto.trailsIds,
      about: editDto.about,
    })

    if (result.isLeft()) {
      const error = result.value
      if (error.statusCode === 404) {
        throw new NotFoundException(error.message)
      }
      throw new BadRequestException(error.message)
    }

    return {
      profile: StudentProfilePresenter.toHTTP(result.value),
    }
  }

  @Get('students')
  @ApiOperation({ summary: 'Fetch students' })
  @ApiResponse({ status: 200, description: 'Students retrieved successfully' })
  async fetchStudents(@Query() query: FetchStudentsDto) {
    const fetchStudentsUseCase = makeFetchStudentsUseCase()

    const result = await fetchStudentsUseCase.execute({
      name: query.name,
    })

    return {
      students: result.map(StudentPresenter.toHTTP),
    }
  }

  @Get('students/:studentId')
  @ApiOperation({ summary: 'Get student details' })
  @ApiResponse({
    status: 200,
    description: 'Student details retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async getStudentDetails(@Param('studentId') studentId: string) {
    const getStudentDetailsUseCase = makeGetStudentDetailsUseCase()

    const result = await getStudentDetailsUseCase.execute({
      username: studentId,
    })

    if (result.isLeft()) {
      const error = result.value
      if (error.statusCode === 404) {
        throw new NotFoundException(error.message)
      }
      throw new BadRequestException(error.message)
    }

    return StudentProfilePresenter.toHTTP(result.value)
  }
}
