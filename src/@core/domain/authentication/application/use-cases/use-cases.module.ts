import { Module } from '@nestjs/common'
import { EditProfileUseCase } from './edit-profile'
import { FetchStudentsUseCase } from './fetch-students'
import { GetProfileUseCase } from './get-profile'
import { LoginUseCase } from './login'
import { RegisterUseCase } from './register'
import { UploadStudentProfileUseCase } from './upload-student-profile'

@Module({
  providers: [
    EditProfileUseCase,
    FetchStudentsUseCase,
    GetProfileUseCase,
    LoginUseCase,
    RegisterUseCase,
    UploadStudentProfileUseCase,
  ],
  exports: [
    EditProfileUseCase,
    FetchStudentsUseCase,
    GetProfileUseCase,
    LoginUseCase,
    RegisterUseCase,
    UploadStudentProfileUseCase,
  ],
})
export class AuthenticationUseCasesModule {}
