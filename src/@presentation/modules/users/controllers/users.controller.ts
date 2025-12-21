import { EditProfileUseCase } from '@/@core/application/users/use-cases/edit-profile'
import { FetchUsersUseCase } from '@/@core/application/users/use-cases/fetch-users'
import { ForgotPasswordUseCase } from '@/@core/application/users/use-cases/forgot-password'
import { GetProfileUseCase } from '@/@core/application/users/use-cases/get-profile'
import { LoginUseCase } from '@/@core/application/users/use-cases/login'
import { RegisterUseCase } from '@/@core/application/users/use-cases/register'
import { ResetPasswordUseCase } from '@/@core/application/users/use-cases/reset-password'
import { UploadStudentProfileUseCase } from '@/@core/application/users/use-cases/upload-student-profile'
import { UserRole } from '@/@core/domain/users/value-objects/user-role'
import { Public } from '@/@presentation/modules/auth/decorators/public.decorator'
import { JwtAuthGuard } from '@/@presentation/modules/auth/guards/jwt-auth.guard'
import { UserPresenter } from '@/@presentation/presenters/user'
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
import { EditProfileDto } from '../dto/edit-profile.dto'
import { FetchStudentsDto } from '../dto/fetch-students.dto'
import { ForgotPasswordDto } from '../dto/forgot-password.dto'
import { LoginStudentDto } from '../dto/login-student.dto'
import { RegisterStudentDto } from '../dto/register-student.dto'
import { ResetPasswordDto } from '../dto/reset-password.dto'
import {
  MessageResponseDto,
  ProfileUpdateResponseDto,
  TokenResponseDto,
  UserIdResponseDto,
  UserResponseDto,
  UsersListResponseDto,
} from '../dto/students-response.dto'

@ApiTags('Usuários')
@Controller()
export class UsersController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly getProfileUseCase: GetProfileUseCase,
    private readonly editProfileUseCase: EditProfileUseCase,
    private readonly fetchUsersUseCase: FetchUsersUseCase,
    private readonly uploadStudentProfileUseCase: UploadStudentProfileUseCase,
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
  ) {}

  @Public()
  @Post('students')
  @ApiOperation({
    summary: 'Cadastrar novo estudante',
    description:
      'Registra um novo estudante na plataforma com informações básicas e acadêmicas.',
  })
  @ApiResponse({
    status: 201,
    description: 'Estudante cadastrado com sucesso.',
    type: UserIdResponseDto,
  })
  @ApiResponse({
    status: 400,
    description:
      'Dados inválidos. Verifique os campos obrigatórios e formatos.',
  })
  @ApiResponse({
    status: 409,
    description: 'Estudante já cadastrado com este email ou nome de usuário.',
  })
  @ApiBody({ type: RegisterStudentDto })
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

  @Public()
  @Post('sessions')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Autenticar estudante',
    description:
      'Realiza login do estudante e retorna um token JWT para autenticação.',
  })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso. Retorna token de acesso.',
    type: TokenResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciais inválidas. Email ou senha incorretos.',
  })
  @ApiBody({ type: LoginStudentDto })
  async login(@Body() loginDto: LoginStudentDto): Promise<TokenResponseDto> {
    const result = await this.loginUseCase.execute({
      email: loginDto.email,
      password: loginDto.password,
    })

    if (result.isLeft()) {
      const error = result.value
      throw new UnauthorizedException(error.message)
    }

    const { user } = result.value

    const token = this.jwtService.sign({
      sub: user.id.toString(),
      role: UserRole.STUDENT,
    })

    const profileResult = await this.getProfileUseCase.execute({
      username: user.username.value,
    })

    if (profileResult.isLeft()) {
      throw new BadRequestException(
        'Não foi possível carregar o perfil do usuário.',
      )
    }

    return {
      token,
      user: UserPresenter.toHTTP(profileResult.value),
    }
  }

  @Public()
  @Get('profiles/:username')
  @ApiOperation({
    summary: 'Buscar perfil por nome de usuário',
    description:
      'Retorna as informações públicas do perfil de um estudante através do nome de usuário.',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil encontrado e retornado com sucesso.',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Estudante não encontrado com o nome de usuário informado.',
  })
  async getProfile(
    @Param('username') username: string,
  ): Promise<UserResponseDto> {
    const result = await this.getProfileUseCase.execute({ username })

    if (result.isLeft()) {
      const error = result.value
      if (error.statusCode === 404) {
        throw new NotFoundException(error.message)
      }
      throw new BadRequestException(error.message)
    }

    return UserPresenter.toHTTP(result.value)
  }

  @Put('profiles/:studentId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Editar perfil do estudante',
    description:
      'Atualiza informações do perfil do estudante. Requer autenticação e o usuário só pode editar seu próprio perfil.',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil atualizado com sucesso.',
    type: ProfileUpdateResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado. Você só pode editar seu próprio perfil.',
  })
  @ApiResponse({
    status: 404,
    description: 'Estudante não encontrado.',
  })
  @ApiBody({ type: EditProfileDto })
  async editProfile(
    @Param('studentId') userId: string,
    @Body() editDto: EditProfileDto,
    @Request() req: { user: { userId: string } },
  ): Promise<ProfileUpdateResponseDto> {
    if (userId !== req.user.userId) {
      throw new ForbiddenException(
        'Você não tem permissão para editar este perfil.',
      )
    }

    const result = await this.editProfileUseCase.execute({
      userId,
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
      profile: UserPresenter.toHTTP(result.value),
    }
  }

  @Public()
  @Get('students')
  @ApiOperation({
    summary: 'Listar estudantes',
    description:
      'Retorna uma lista de estudantes cadastrados. Permite filtro por nome.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de estudantes retornada com sucesso.',
    type: UsersListResponseDto,
  })
  async fetchStudents(
    @Query() query: FetchStudentsDto,
  ): Promise<UsersListResponseDto> {
    const result = await this.fetchUsersUseCase.execute({
      name: query.name,
    })

    return {
      users: result.map(UserPresenter.summaryToHTTP),
    }
  }

  @Get('students/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar dados do perfil atual',
    description:
      'Retorna as informações detalhadas do estudante autenticado baseado no token JWT.',
  })
  @ApiResponse({
    status: 200,
    description: 'Dados do perfil retornados com sucesso.',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Não autenticado.',
  })
  async getMe(
    @Request() req: { user: { userId: string } },
  ): Promise<UserResponseDto> {
    const result = await this.getProfileUseCase.execute({
      userId: req.user.userId,
    })

    if (result.isLeft()) {
      throw new BadRequestException('Não foi possível carregar seu perfil.')
    }

    return UserPresenter.toHTTP(result.value)
  }

  @Public()
  @Get('students/:studentId')
  @ApiOperation({
    summary: 'Buscar detalhes do estudante',
    description: 'Retorna informações detalhadas de um estudante específico.',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalhes do estudante retornados com sucesso.',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Estudante não encontrado.',
  })
  async getStudentDetails(
    @Param('studentId') studentId: string,
  ): Promise<UserResponseDto> {
    const result = await this.getProfileUseCase.execute({
      userId: studentId,
    })

    if (result.isLeft()) {
      const error = result.value
      if (error.statusCode === 404) {
        throw new NotFoundException(error.message)
      }
      throw new BadRequestException(error.message)
    }

    return UserPresenter.toHTTP(result.value)
  }

  @Post('profile-images/:username')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Fazer upload da foto de perfil',
    description:
      'Envia uma imagem para ser usada como foto de perfil do estudante. Formatos aceitos: JPG, PNG. Tamanho máximo: 5MB.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Arquivo de imagem (JPG ou PNG)',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Foto de perfil enviada com sucesso.',
    type: MessageResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Arquivo inválido ou não fornecido.',
  })
  @ApiResponse({
    status: 404,
    description: 'Estudante não encontrado.',
  })
  async uploadProfileImage(
    @Param('username') username: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<MessageResponseDto> {
    if (!file) {
      throw new BadRequestException('É necessário enviar um arquivo de imagem.')
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

    return { message: 'Foto de perfil enviada com sucesso.' }
  }

  @Patch('token/refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Renovar token de autenticação',
    description:
      'Gera um novo token JWT para o usuário autenticado, permitindo continuar usando a aplicação.',
  })
  @ApiResponse({
    status: 200,
    description: 'Token renovado com sucesso.',
    type: TokenResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Não autenticado. Token inválido ou expirado.',
  })
  async refreshToken(
    @Request() req: { user: { userId: string } },
  ): Promise<TokenResponseDto> {
    const token = this.jwtService.sign({
      sub: req.user.userId,
      role: UserRole.STUDENT,
    })

    // To get the full profile, we need the username or ID.
    // We'll use the ID as it's more reliable since it comes from the token.
    const user = await this.getProfileUseCase.execute({
      userId: req.user.userId,
    })

    if (user.isLeft()) {
      throw new UnauthorizedException('Usuário não encontrado.')
    }

    return {
      token,
      user: UserPresenter.toHTTP(user.value),
    }
  }

  @Public()
  @Post('password/forgot')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Solicitar recuperação de senha',
    description:
      'Envia um email com um token para recuperação de senha caso o email esteja cadastrado.',
  })
  @ApiResponse({
    status: 200,
    description: 'Email de recuperação enviado (se o usuário existir).',
    type: MessageResponseDto,
  })
  async forgotPassword(
    @Body() dto: ForgotPasswordDto,
  ): Promise<MessageResponseDto> {
    await this.forgotPasswordUseCase.execute({
      email: dto.email,
    })

    // Always return OK to prevent email enumeration
    return {
      message:
        'Se o email estiver cadastrado, você receberá instruções para recuperar sua senha.',
    }
  }

  @Public()
  @Post('password/reset')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Redefinir senha',
    description: 'Redefine a senha do usuário utilizando o token recebido.',
  })
  @ApiResponse({
    status: 200,
    description: 'Senha redefinida com sucesso.',
    type: MessageResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Token inválido, expirado ou senha inválida.',
  })
  async resetPassword(
    @Body() dto: ResetPasswordDto,
  ): Promise<MessageResponseDto> {
    const result = await this.resetPasswordUseCase.execute({
      token: dto.token,
      newPassword: dto.newPassword,
    })

    if (result.isLeft()) {
      throw new BadRequestException('Token inválido ou expirado.')
    }

    return { message: 'Senha redefinida com sucesso.' }
  }
}
