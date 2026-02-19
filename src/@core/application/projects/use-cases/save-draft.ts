import { Injectable } from '@nestjs/common'
import { NonSelectableTrailError } from '@/@core/application/trails/errors/non-selectable-trail.error'
import { TrailsRepository } from '@/@core/application/trails/repositories/trails-repository'
import { isSelectableTrail } from '@/@core/application/trails/utils/is-selectable-trail'
import { UsersRepository } from '@/@core/application/users/repositories/users-repository'
import { Project } from '@/@core/domain/projects/entities/project'
import { ProjectStatus } from '@/@core/domain/projects/value-objects/project-status'
import { Either, left, right } from '@/@shared/kernel/either'
import { ResourceNotFoundError } from '@/@shared/kernel/errors/resource-not-found.error'
import { UniqueEntityID } from '@/@shared/kernel/kernel/unique-entity-id'
import type { User } from '../../../domain/users/entities/user'
import { ProjectsRepository } from '../repositories/projects-repository'

interface SaveDraftUseCaseRequest {
  title: string
  description: string
  bannerUrl?: string
  content?: string
  publishedYear: number
  semester: number
  allowComments: boolean
  authorId: string
  subjectId?: string
  trailsIds: string[]
  professorsIds?: string[]
  draftId?: string
}

type SaveDraftUseCaseResponse = Either<
  ResourceNotFoundError | NonSelectableTrailError,
  {
    projectId: string
  }
>

@Injectable()
export class SaveDraftUseCase {
  constructor(
    private readonly projectsRepository: ProjectsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly trailsRepository: TrailsRepository,
  ) {}

  async execute({
    title,
    description,
    bannerUrl,
    content,
    publishedYear,
    semester,
    allowComments,
    authorId,
    subjectId,
    trailsIds,
    professorsIds,
    draftId,
  }: SaveDraftUseCaseRequest): Promise<SaveDraftUseCaseResponse> {
    const student = await this.usersRepository.findById(authorId)
    if (!student) {
      return left(new ResourceNotFoundError('Student not found.'))
    }

    const trailsValidation = await this.validateTrails(trailsIds)
    if (trailsValidation.isLeft()) {
      return left(trailsValidation.value)
    }

    if (draftId) {
      return this.updateDraft({
        draftId,
        authorId,
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
      })
    }

    return this.createDraft({
      student,
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
    })
  }

  private async validateTrails(
    trailsIds: string[],
  ): Promise<Either<ResourceNotFoundError | NonSelectableTrailError, null>> {
    for (const trailId of trailsIds) {
      const trail = await this.trailsRepository.findById(trailId)

      if (!trail) {
        return left(new ResourceNotFoundError('Trail not found.'))
      }

      if (!isSelectableTrail(trail)) {
        return left(new NonSelectableTrailError())
      }
    }

    return right(null)
  }

  private async updateDraft({
    draftId,
    authorId,
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
  }: Omit<SaveDraftUseCaseRequest, 'authorId'> & {
    draftId: string
    authorId: string
  }): Promise<SaveDraftUseCaseResponse> {
    const draft = await this.projectsRepository.findById(draftId)

    if (!draft) {
      return left(new ResourceNotFoundError('Draft not found.'))
    }

    if (draft.authorId.toString() !== authorId) {
      return left(new ResourceNotFoundError('Draft not found.')) // Security: don't reveal existence
    }

    draft.editInfo({
      title,
      description,
      bannerUrl,
      content,
      publishedYear,
      semester,
      allowComments,
      subjectId: subjectId ? new UniqueEntityID(subjectId) : undefined,
    })

    draft.defineTrails(trailsIds.map(id => new UniqueEntityID(id)))
    draft.defineProfessors(
      professorsIds?.map(id => new UniqueEntityID(id)) || [],
    )

    await this.projectsRepository.save(draft)

    return right({
      projectId: draft.id.toString(),
    })
  }

  private async createDraft({
    student,
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
  }: Omit<SaveDraftUseCaseRequest, 'authorId' | 'draftId'> & {
    student: User
  }): Promise<SaveDraftUseCaseResponse> {
    const project = Project.create({
      title,
      description,
      bannerUrl,
      content: content || '',
      publishedYear,
      semester,
      allowComments,
      status: ProjectStatus.DRAFT,
      authorId: student.id,
      subjectId: subjectId ? new UniqueEntityID(subjectId) : undefined,
      trails: new Set(trailsIds.map(id => new UniqueEntityID(id))),
      professors: new Set(
        professorsIds?.map(id => new UniqueEntityID(id)) || [],
      ),
    })

    await this.projectsRepository.create(project)

    return right({
      projectId: project.id.toString(),
    })
  }
}
