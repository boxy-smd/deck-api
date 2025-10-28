import type { UsersRepository } from '@/domain/authentication/application/repositories/users-repository.ts'
import type { ProjectsRepository } from '@/domain/projects/application/repositories/projects-repository.ts'
import type { Project } from '@/domain/projects/enterprise/entities/project.ts'
import { type Either, left, right } from '@/shared/either.ts'
import { ForbiddenError } from '@/shared/errors/forbidden.error.ts'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found.error.ts'
import { UniqueEntityID } from '@/shared/kernel/unique-entity-id.ts'
import type { ProfessorsRepository } from '../../../projects/application/repositories/professors-repository.ts'
import type { SubjectsRepository } from '../../../projects/application/repositories/subjects-repository.ts'
import type { TrailsRepository } from '../../../projects/application/repositories/trails-repository.ts'

interface EditDraftUseCaseRequest {
  authorId: string
  draftId: string
  title?: string
  description?: string
  bannerUrl?: string
  content?: string
  publishedYear?: number
  semester?: number
  allowComments?: boolean
  subjectId?: string
  trailsIds?: string[]
  professorsIds?: string[]
}

type EditDraftUseCaseResponse = Either<
  ForbiddenError | ResourceNotFoundError,
  Project
>

export class EditDraftUseCase {
  constructor(
    private readonly projectsRepository: ProjectsRepository,
    private readonly studentsRepository: UsersRepository,
    private readonly subjectsRepository: SubjectsRepository,
    private readonly trailsRepository: TrailsRepository,
    private readonly professorsRepository: ProfessorsRepository,
  ) {}

  async execute({
    authorId,
    draftId,
    title,
    description,
    bannerUrl,
    content,
    publishedYear,
    semester,
    allowComments,
    subjectId,
    trailsIds,
    professorsIds,
  }: EditDraftUseCaseRequest): Promise<EditDraftUseCaseResponse> {
    if (!authorId) {
      return left(new ForbiddenError('You must be logged in to edit a draft.'))
    }

    const student = await this.studentsRepository.findById(
      UniqueEntityID.create(authorId),
    )

    if (!student) {
      return left(new ResourceNotFoundError('Student not found.'))
    }

    const draft = await this.projectsRepository.findById(
      new UniqueEntityID(draftId),
    )

    if (!draft) {
      return left(new ResourceNotFoundError('Draft not found.'))
    }

    if (draft.authorId.toString() !== authorId) {
      return left(new ForbiddenError('You are not allowed to edit this draft.'))
    }

    draft.editInfo({
      title,
      description,
      bannerUrl,
      content,
      publishedYear,
      semester,
      allowComments,
    })

    if (subjectId) {
      const subject = await this.subjectsRepository.findById(
        UniqueEntityID.create(subjectId),
      )

      if (!subject) {
        return left(new ResourceNotFoundError('Subject not found.'))
      }

      draft.editInfo({ subjectId: subject.id })
    }

    const trails = await Promise.all(
      trailsIds
        ? trailsIds.map(async trailId => {
            const trail = await this.trailsRepository.findById(
              UniqueEntityID.create(trailId),
            )

            return trail
          })
        : [],
    )

    if (trails.some(trail => !trail)) {
      return left(new ResourceNotFoundError('Some trails were not found.'))
    }

    draft.defineTrails(
      trails.filter(trail => trail !== null).map(trail => trail.id),
    )

    const professors = await Promise.all(
      professorsIds
        ? professorsIds.map(async professorId => {
            const professor = await this.professorsRepository.findById(
              UniqueEntityID.create(professorId),
            )

            return professor
          })
        : [],
    )

    if (professors.some(professor => !professor)) {
      return left(new ResourceNotFoundError('Some professors were not found.'))
    }

    draft.defineProfessors(
      professors
        .filter(professor => professor !== null)
        .map(professor => professor.id),
    )

    await this.projectsRepository.save(draft)

    return right(draft)
  }
}
