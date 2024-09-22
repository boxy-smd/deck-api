import { type Either, left, right } from '@/core/either.ts'
import { ForbiddenError } from '@/core/errors/forbidden.error.ts'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error.ts'
import {
  Project,
  type ProjectStatusEnum,
} from '../../enterprise/entities/project.ts'
import type { Subject } from '../../enterprise/entities/subject.ts'
import type { DraftsRepository } from '../repositories/drafts-repository.ts'
import type { ProfessorsRepository } from '../repositories/professors-repository.ts'
import type { ProjectsRepository } from '../repositories/projects-repository.ts'
import type { StudentsRepository } from '../repositories/students-repository.ts'
import type { SubjectsRepository } from '../repositories/subjects-repository.ts'
import type { TrailsRepository } from '../repositories/trails-repository.ts'

interface PublishProjectUseCaseRequest {
  title: string
  description: string
  bannerUrl?: string
  content?: string
  publishedYear: number
  status: ProjectStatusEnum
  semester: number
  allowComments: boolean
  authorId: string
  subjectId?: string
  trailsIds: string[]
  professorsIds?: string[]
  draftId?: string
}

type PublishProjectUseCaseResponse = Either<
  ForbiddenError | ResourceNotFoundError,
  {
    projectId: string
  }
>

export class PublishProjectUseCase {
  constructor(
    private readonly projectsRepository: ProjectsRepository,
    private readonly studentsRepository: StudentsRepository,
    private readonly subjectsRepository: SubjectsRepository,
    private readonly trailsRepository: TrailsRepository,
    private readonly professorsRepository: ProfessorsRepository,
    private readonly draftsRepository: DraftsRepository,
  ) {}

  async execute({
    title,
    description,
    bannerUrl,
    content,
    publishedYear,
    status,
    semester,
    allowComments,
    authorId,
    subjectId,
    trailsIds,
    professorsIds,
    draftId,
  }: PublishProjectUseCaseRequest): Promise<PublishProjectUseCaseResponse> {
    if (!authorId) {
      return left(
        new ForbiddenError('You must be logged in to publish a project.'),
      )
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

    const trails = await Promise.all(
      trailsIds.map(async trailId => {
        const trail = await this.trailsRepository.findById(trailId)

        return trail
      }),
    )

    if (trails.some(trail => !trail)) {
      return left(new ResourceNotFoundError('Trail not found.'))
    }

    const professors = await Promise.all(
      professorsIds
        ? professorsIds.map(async professorId => {
            const professor =
              await this.professorsRepository.findById(professorId)

            return professor
          })
        : [],
    )

    if (professorsIds && professors.some(professor => !professor)) {
      return left(new ResourceNotFoundError('Professor not found.'))
    }

    const project = Project.create({
      title,
      description,
      bannerUrl,
      content,
      publishedYear,
      status,
      semester,
      allowComments,
      authorId: student.id,
      subjectId: subject?.id,
      trails: trails.filter(trail => trail !== null),
      professors: professors.filter(professor => professor !== null),
    })

    await this.projectsRepository.create(project)

    if (draftId) {
      await this.draftsRepository.delete(draftId)
    }

    return right({
      projectId: project.id.toString(),
    })
  }
}
