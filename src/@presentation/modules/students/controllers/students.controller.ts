import type { EditProfileUseCase } from '@/@core/application/users/use-cases/edit-profile'
import type { FetchStudentsUseCase } from '@/@core/application/users/use-cases/fetch-users'
import type { GetProfileUseCase } from '@/@core/application/users/use-cases/get-profile'
import type { LoginUseCase } from '@/@core/application/users/use-cases/login'
import type { RegisterUseCase } from '@/@core/application/users/use-cases/register'
import type { UploadStudentProfileUseCase } from '@/@core/application/users/use-cases/upload-student-profile'
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
import type { JwtService } from '@nestjs/jwt'
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
import {
  MessageResponseDto,
  ProfileUpdateResponseDto,
  StudentProfileResponseDto,
  StudentsListResponseDto,
  TokenResponseDto,
  UserIdResponseDto,
} from '../dto/students-response.dto'

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
  @ApiResponse({
    status: 201,
    description: 'Student registered successfully',
    type: UserIdResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Student already exists' })
  async register(
    @Body() registerDto: RegisterStudentDto,
  ): Promise<UserIdResponseDto> {
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
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: TokenResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginStudentDto): Promise<TokenResponseDto> {
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
  @ApiResponse({
    status: 200,
    description: 'Profile retrieved successfully',
    type: StudentProfileResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async getProfile(
    @Param('username') username: string,
  ): Promise<StudentProfileResponseDto> {
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
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
    type: ProfileUpdateResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async editProfile(
    @Param('studentId') studentId: string,
    @Body() editDto: EditProfileDto,
    @Request() req: { user: { userId: string } },
  ): Promise<ProfileUpdateResponseDto> {
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
  @ApiResponse({
    status: 200,
    description: 'Students retrieved successfully',
    type: StudentsListResponseDto,
  })
  async fetchStudents(
    @Query() query: FetchStudentsDto,
  ): Promise<StudentsListResponseDto> {
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
    type: StudentProfileResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async getStudentDetails(
    @Param('studentId') studentId: string,
  ): Promise<StudentProfileResponseDto> {
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
    type: MessageResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async uploadProfileImage(
    @Param('username') username: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<MessageResponseDto> {
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
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    type: TokenResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async refreshToken(
    @Request() req: { user: { userId: string } },
  ): Promise<TokenResponseDto> {
    const token = this.jwtService.sign({
      sub: req.user.userId,
      role: 'student',
    })

    return new Promise(resolve => {
      resolve({ token })
    })
  }
}
