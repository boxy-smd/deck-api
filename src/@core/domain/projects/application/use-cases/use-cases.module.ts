import { Module } from '@nestjs/common'
import { DeleteProjectUseCase } from './delete-project'
import { FetchProfessorsUseCase } from './fetch-professors'
import { FetchSubjectsUseCase } from './fetch-subjects'
import { FetchTrailsUseCase } from './fetch-trails'
import { GetProjectUseCase } from './get-project'
import { PublishProjectUseCase } from './publish-project'
import { SearchProjectsUseCase } from './search-projects'
import { UploadProjectBannerUseCase } from './upload-project-banner'

@Module({
  providers: [
    DeleteProjectUseCase,
    FetchProfessorsUseCase,
    FetchSubjectsUseCase,
    FetchTrailsUseCase,
    GetProjectUseCase,
    PublishProjectUseCase,
    SearchProjectsUseCase,
    UploadProjectBannerUseCase,
  ],
  exports: [
    DeleteProjectUseCase,
    FetchProfessorsUseCase,
    FetchSubjectsUseCase,
    FetchTrailsUseCase,
    GetProjectUseCase,
    PublishProjectUseCase,
    SearchProjectsUseCase,
    UploadProjectBannerUseCase,
  ],
})
export class ProjectsUseCasesModule {}
