import { type Either, left, right } from '@/core/either.ts'
import { ForbiddenError } from '@/core/errors/forbidden.error.ts'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error.ts'
import { Draft } from '../../enterprise/entities/draft.ts'
import type { Subject } from '../../enterprise/entities/subject.ts'
import type { DraftsRepository } from '../repositories/drafts-repository.ts'
import type { ProfessorsRepository } from '../repositories/professors-repository.ts'
import type { StudentsRepository } from '../repositories/students-repository.ts'
import type { SubjectsRepository } from '../repositories/subjects-repository.ts'
import type { TrailsRepository } from '../repositories/trails-repository.ts'

interface CreateDraftUseCaseRequest {
  title: string
  description?: string
  bannerUrl?: string
  content?: string
  publishedYear?: number
  semester?: number
  allowComments?: boolean
  authorId: string
  subjectId?: string
  trailsIds?: string[]
  professorsIds?: string[]
}

type CreateDraftUseCaseResponse = Either<
  ForbiddenError | ResourceNotFoundError,
  {
    draftId: string
  }
>

export class CreateDraftUseCase {
  constructor(
    private readonly draftsRepository: DraftsRepository,
    private readonly studentsRepository: StudentsRepository,
    private readonly subjectsRepository: SubjectsRepository,
    private readonly trailsRepository: TrailsRepository,
    private readonly professorsRepository: ProfessorsRepository,
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
  }: CreateDraftUseCaseRequest): Promise<CreateDraftUseCaseResponse> {
    if (!authorId) {
      return left(
        new ForbiddenError('You must be logged in to create a draft.'),
      )
    }

    if (!title) {
      return left(new ForbiddenError('You must provide a title for the draft.'))
    }

    const student = await this.studentsRepository.findById(authorId)

    if (!student) {
      return left(new ResourceNotFoundError('Student not found.'))
    }

    let subject: Subject | null = null

    if (subjectId) {
      subject = await this.subjectsRepository.findById(subjectId)

      if (!subject) {
        return left(new ResourceNotFoundError('Subject not found.'))
      }
    }

    const trails = trailsIds
      ? await Promise.all(
          trailsIds.map(async trailId => {
            const trail = await this.trailsRepository.findById(trailId)

            return trail
          }),
        )
      : []

    if (trails.some(trail => !trail)) {
      return left(new ResourceNotFoundError('Trail not found.'))
    }

    const professors = professorsIds
      ? await Promise.all(
          professorsIds.map(async professorId => {
            const professor =
              await this.professorsRepository.findById(professorId)

            return professor
          }),
        )
      : []

    if (professorsIds && professors.some(professor => !professor)) {
      return left(new ResourceNotFoundError('Professor not found.'))
    }

    const draft = Draft.create({
      title,
      description,
      bannerUrl,
      content,
      publishedYear,
      semester,
      allowComments,
      authorId: student.id,
      subjectId: subject?.id,
      trails: trails.filter(trail => trail !== null),
      professors: professors.filter(professor => professor !== null),
    })

    console.log(draft.id, draft.authorId)

    await this.draftsRepository.create(draft)

    return right({
      draftId: draft.id.toString(),
    })
  }
}
