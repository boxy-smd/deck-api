import { CommentOnProjectUseCase } from '@/@core/application/interactions/use-cases/comment-on-project'
import { DeleteCommentUseCase } from '@/@core/application/interactions/use-cases/delete-comment'
import { ListProjectCommentsUseCase } from '@/@core/application/interactions/use-cases/list-project-comments'
import { ReportCommentUseCase } from '@/@core/application/interactions/use-cases/report-comment'
import { DeleteProjectUseCase } from '@/@core/application/projects/use-cases/delete-project'
import { FetchProfessorsUseCase } from '@/@core/application/projects/use-cases/fetch-professors'
import { FetchSubjectsUseCase } from '@/@core/application/projects/use-cases/fetch-subjects'
import { FetchTrailsUseCase } from '@/@core/application/projects/use-cases/fetch-trails'
import { GetProjectUseCase } from '@/@core/application/projects/use-cases/get-project'
import { PublishProjectUseCase } from '@/@core/application/projects/use-cases/publish-project'
import { SearchProjectsUseCase } from '@/@core/application/projects/use-cases/search-projects'
import { UploadProjectBannerUseCase } from '@/@core/application/projects/use-cases/upload-project-banner'
import { EditProfileUseCase } from '@/@core/application/users/use-cases/edit-profile'
import { FetchUsersUseCase } from '@/@core/application/users/use-cases/fetch-users'
import { GetProfileUseCase } from '@/@core/application/users/use-cases/get-profile'
import { LoginUseCase } from '@/@core/application/users/use-cases/login'
import { RegisterUseCase } from '@/@core/application/users/use-cases/register'
import { UploadStudentProfileUseCase } from '@/@core/application/users/use-cases/upload-student-profile'
import { CryptographyModule } from '@/@infra/cryptography/cryptography.module'
import { DatabaseModule } from '@/@infra/database/database.module'
import { StorageModule } from '@/@infra/storage/storage.module'
import { Module } from '@nestjs/common'
import { CommentsController } from './comments/controllers/comments.controller'
import { ProfessorsController } from './professors/controllers/professors.controller'
import { ProjectsController } from './projects/controllers/projects.controller'
import { PublishProjectResponseDto } from './projects/dto/projects-response.dto'
import { SubjectsController } from './subjects/controllers/subjects.controller'
import { TrailsController } from './trails/controllers/trails.controller'
import { StudentsController } from './users/controllers/users.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [
    CommentsController,
    ProfessorsController,
    SubjectsController,
    StudentsController,
    ProjectsController,
    TrailsController,
  ],
  providers: [
    CommentOnProjectUseCase,
    DeleteCommentUseCase,
    ListProjectCommentsUseCase,
    ReportCommentUseCase,
    DeleteProjectUseCase,
    FetchProfessorsUseCase,
    FetchSubjectsUseCase,
    FetchTrailsUseCase,
    GetProjectUseCase,
    PublishProjectUseCase,
    PublishProjectResponseDto,
    SearchProjectsUseCase,
    UploadProjectBannerUseCase,
    EditProfileUseCase,
    FetchUsersUseCase,
    GetProfileUseCase,
    LoginUseCase,
    RegisterUseCase,
    UploadStudentProfileUseCase,
  ],
})
export class HttpModule {}
