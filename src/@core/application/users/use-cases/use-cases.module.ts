import { Module } from '@nestjs/common'
import { EditProfileUseCase } from './edit-profile'
import { FetchUsersUseCase } from './fetch-users'
import { GetProfileUseCase } from './get-profile'
import { LoginUseCase } from './login'
import { RegisterUseCase } from './register'
import { UploadStudentProfileUseCase } from './upload-student-profile'

@Module({
  providers: [
    EditProfileUseCase,
    FetchUsersUseCase,
    GetProfileUseCase,
    LoginUseCase,
    RegisterUseCase,
    UploadStudentProfileUseCase,
  ],
  exports: [
    EditProfileUseCase,
    FetchUsersUseCase,
    GetProfileUseCase,
    LoginUseCase,
    RegisterUseCase,
    UploadStudentProfileUseCase,
  ],
})
export class UsersUseCasesModule {}
