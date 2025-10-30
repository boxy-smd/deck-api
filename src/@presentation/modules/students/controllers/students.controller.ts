import { EditProfileUseCase } from '@/@core/domain/authentication/application/use-cases/edit-profile'
import { FetchStudentsUseCase } from '@/@core/domain/authentication/application/use-cases/fetch-students'
import { GetProfileUseCase } from '@/@core/domain/authentication/application/use-cases/get-profile'
import { LoginUseCase } from '@/@core/domain/authentication/application/use-cases/login'
import { RegisterUseCase } from '@/@core/domain/authentication/application/use-cases/register'
import { UploadStudentProfileUseCase } from '@/@core/domain/authentication/application/use-cases/upload-student-profile'
import { JwtAuthGuard } from '@/@presentation/modules/auth/guards/jwt-auth.guard'
import { StudentPresenter } from '@/@presentation/presenters/student'
import { StudentProfilePresenter } from '@/@presentation/presenters/student-profile'
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
  Patch,
  Post,
  Put,
  Query,
  Request,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { FileInterceptor } from '@nestjs/platform-express'
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
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
  constructor(
    private readonly jwtService: JwtService,
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly getProfileUseCase: GetProfileUseCase,
    private readonly editProfileUseCase: EditProfileUseCase,
    private readonly fetchStudentsUseCase: FetchStudentsUseCase,
    private readonly uploadStudentProfileUseCase: UploadStudentProfileUseCase,
  ) {}

  @Post('students')
  @ApiOperation({ summary: 'Register a new student' })
  @ApiResponse({ status: 201, description: 'Student registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Student already exists' })
  async register(@Body() registerDto: RegisterStudentDto) {
    const result = await this.registerUseCase.execute({
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
    const result = await this.loginUseCase.execute({
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
    const result = await this.getProfileUseCase.execute({ username })

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

    const result = await this.editProfileUseCase.execute({
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
    const result = await this.fetchStudentsUseCase.execute({
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
    const result = await this.getProfileUseCase.execute({
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

  @Post('profile-images/:username')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload student profile image' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Profile image uploaded successfully',
  })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async uploadProfileImage(
    @Param('username') username: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File is required')
    }

    const result = await this.uploadStudentProfileUseCase.execute({
      username,
      filename: file.originalname,
      image: file.buffer,
    })

    if (result.isLeft()) {
      const error = result.value
      if (error.statusCode === 404) {
        throw new NotFoundException(error.message)
      }
      throw new BadRequestException(error.message)
    }

    return { message: 'Profile image uploaded successfully' }
  }

  @Patch('token/refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refresh JWT token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async refreshToken(@Request() req: any) {
    const token = this.jwtService.sign({
      sub: req.user.userId,
      role: 'student',
    })

    return { token }
  }
}
