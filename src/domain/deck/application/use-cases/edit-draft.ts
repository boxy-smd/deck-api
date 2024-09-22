import { type Either, left, right } from '@/core/either.ts'
import { ForbiddenError } from '@/core/errors/forbidden.error.ts'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error.ts'
import type { Draft } from '../../enterprise/entities/draft.ts'
import type { Trail } from '../../enterprise/entities/trail.ts'
import type { DraftsRepository } from '../repositories/drafts-repository.ts'
import type { ProfessorsRepository } from '../repositories/professors-repository.ts'
import type { StudentsRepository } from '../repositories/students-repository.ts'
import type { SubjectsRepository } from '../repositories/subjects-repository.ts'
import type { TrailsRepository } from '../repositories/trails-repository.ts'

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
  Draft
>

export class EditDraftUseCase {
  constructor(
    private readonly draftsRepository: DraftsRepository,
    private readonly studentsRepository: StudentsRepository,
    private readonly subjectsRepository: SubjectsRepository,
    private readonly trailsRepository: TrailsRepository,
    private readonly professorsRepository: ProfessorsRepository,
  ) {}

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: This function is complex by nature
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

    const student = await this.studentsRepository.findById(authorId)

    if (!student) {
      return left(new ResourceNotFoundError('Student not found.'))
    }

    const draft = await this.draftsRepository.findById(draftId)

    if (!draft) {
      return left(new ResourceNotFoundError('Draft not found.'))
    }

    if (draft.authorId.toString() !== authorId) {
      return left(new ForbiddenError('You are not allowed to edit this draft.'))
    }

    draft.title = title ?? draft.title
    draft.description = description ?? draft.description
    draft.bannerUrl = bannerUrl ?? draft.bannerUrl
    draft.content = content ?? draft.content
    draft.publishedYear = publishedYear ?? draft.publishedYear
    draft.semester = semester ?? draft.semester
    draft.allowComments = allowComments ?? draft.allowComments

    if (subjectId) {
      const subject = await this.subjectsRepository.findById(subjectId)

      if (!subject) {
        return left(new ResourceNotFoundError('Subject not found.'))
      }

      draft.subjectId = subject.id
    }

    const trails = await Promise.all(
      trailsIds
        ? trailsIds.map(async trailId => {
            const trail = await this.trailsRepository.findById(trailId)

            return trail
          })
        : [],
    )

    if (trails.some(trail => !trail)) {
      return left(new ResourceNotFoundError('Some trails were not found.'))
    }

    draft.trails = trails.filter(trail => trail !== null) as Trail[]

    const professors = await Promise.all(
      professorsIds
        ? professorsIds.map(async professorId => {
            const professor =
              await this.professorsRepository.findById(professorId)

            return professor
          })
        : [],
    )

    if (professors.some(professor => !professor)) {
      return left(new ResourceNotFoundError('Some professors were not found.'))
    }

    draft.professors = professors.filter(professor => professor !== null)

    await this.draftsRepository.save(draft)

    return right(draft)
  }
}
