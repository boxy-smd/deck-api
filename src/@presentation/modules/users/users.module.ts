import { EditProfileUseCase } from '@/@core/application/users/use-cases/edit-profile'
import { FetchUsersUseCase } from '@/@core/application/users/use-cases/fetch-users'
import { ForgotPasswordUseCase } from '@/@core/application/users/use-cases/forgot-password'
import { GetProfileUseCase } from '@/@core/application/users/use-cases/get-profile'
import { LoginUseCase } from '@/@core/application/users/use-cases/login'
import { RegisterUseCase } from '@/@core/application/users/use-cases/register'
import { ResetPasswordUseCase } from '@/@core/application/users/use-cases/reset-password'
import { UploadStudentProfileUseCase } from '@/@core/application/users/use-cases/upload-student-profile'
import { CryptographyModule } from '@/@infra/cryptography/cryptography.module'
import { DatabaseModule } from '@/@infra/database/database.module'
import { ServicesModule } from '@/@infra/services/services.module'
import { StorageModule } from '@/@infra/storage/storage.module'
import { Module } from '@nestjs/common'
import { UsersController } from './controllers/users.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule, ServicesModule],
  controllers: [UsersController],
  providers: [
    EditProfileUseCase,
    FetchUsersUseCase,
    GetProfileUseCase,
    LoginUseCase,
    RegisterUseCase,
    UploadStudentProfileUseCase,
    ForgotPasswordUseCase,
    ResetPasswordUseCase,
  ],
})
export class UsersModule {}
