import { DeleteProjectUseCase } from '@/@core/application/projects/use-cases/delete-project'
import { GetProjectUseCase } from '@/@core/application/projects/use-cases/get-project'
import { ListDraftsUseCase } from '@/@core/application/projects/use-cases/list-drafts'
import { PublishProjectUseCase } from '@/@core/application/projects/use-cases/publish-project'
import { SaveDraftUseCase } from '@/@core/application/projects/use-cases/save-draft'
import { SearchProjectsUseCase } from '@/@core/application/projects/use-cases/search-projects'
import { UploadProjectBannerUseCase } from '@/@core/application/projects/use-cases/upload-project-banner'
import { FetchProfessorsUseCase } from '@/@core/application/professors/use-cases/fetch-professors'
import { FetchSubjectsUseCase } from '@/@core/application/subjects/use-cases/fetch-subjects'
import { FetchTrailsUseCase } from '@/@core/application/trails/use-cases/fetch-trails'
import { DatabaseModule } from '@/@infra/database/database.module'
import { StorageModule } from '@/@infra/storage/storage.module'
import { Module } from '@nestjs/common'
import { ProfessorsController } from '../professors/controllers/professors.controller'
import { ProjectsController } from './controllers/projects.controller'
import { SubjectsController } from '../subjects/controllers/subjects.controller'
import { TrailsController } from '../trails/controllers/trails.controller'

@Module({
  imports: [DatabaseModule, StorageModule],
  controllers: [
    ProjectsController,
    ProfessorsController,
    SubjectsController,
    TrailsController,
  ],
  providers: [
    DeleteProjectUseCase,
    GetProjectUseCase,
    ListDraftsUseCase,
    PublishProjectUseCase,
    SaveDraftUseCase,
    SearchProjectsUseCase,
    UploadProjectBannerUseCase,
    FetchProfessorsUseCase,
    FetchSubjectsUseCase,
    FetchTrailsUseCase,
  ],
})
export class ProjectsModule {}
