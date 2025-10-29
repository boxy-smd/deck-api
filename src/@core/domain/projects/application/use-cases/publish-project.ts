import type { UsersRepository } from '@/@core/domain/authentication/application/repositories/users-repository'
import { Project } from '@/@core/domain/projects/enterprise/entities/project'
import type { Subject } from '@/@core/domain/projects/enterprise/entities/subject'
import { ProjectStatus } from '@/@core/domain/projects/enterprise/value-objects/project-status'
import { type Either, left, right } from '@/@shared/kernel/either'
import { ForbiddenError } from '@/@shared/kernel/errors/forbidden.error'
import { ResourceNotFoundError } from '@/@shared/kernel/errors/resource-not-found.error'
import type { ProfessorsRepository } from '../repositories/professors-repository'
import type { ProjectsRepository } from '../repositories/projects-repository'
import type { SubjectsRepository } from '../repositories/subjects-repository'
import type { TrailsRepository } from '../repositories/trails-repository'

interface PublishProjectUseCaseRequest {
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

type PublishProjectUseCaseResponse = Either<
  ForbiddenError | ResourceNotFoundError,
  {
    projectId: string
  }
>

export class PublishProjectUseCase {
  constructor(
    private readonly projectsRepository: ProjectsRepository,
    private readonly studentsRepository: UsersRepository,
    private readonly subjectsRepository: SubjectsRepository,
    private readonly trailsRepository: TrailsRepository,
    private readonly professorsRepository: ProfessorsRepository,
  ) {}

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: This logic will be refactored soon.
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

    let createdProjectId = ''

    if (draftId) {
      const draft = await this.projectsRepository.findById(draftId)

      if (!draft) {
        return left(new ResourceNotFoundError('Draft not found.'))
      }

      if (draft.authorId.toString() !== authorId) {
        return left(
          new ForbiddenError('You are not allowed to publish this draft.'),
        )
      }

      draft.post()

      draft.editInfo({
        title,
        description,
        bannerUrl,
        content,
        publishedYear,
        semester,
        allowComments,
        subjectId: subject ? subject.id : undefined,
      })

      if (trails.length > 0) {
        draft.defineTrails(
          trails.filter(trail => trail !== null).map(trail => trail.id),
        )
      }

      if (professors.length > 0) {
        draft.defineProfessors(
          professors
            .filter(professor => professor !== null)
            .map(professor => professor.id),
        )
      }

      await this.projectsRepository.save(draft)

      createdProjectId = draft.id.toString()
    } else {
      const project = Project.create({
        title,
        description,
        bannerUrl,
        content: content || '',
        publishedYear,
        semester,
        allowComments,
        status: ProjectStatus.PUBLISHED,
        authorId: student.id,
        subjectId: subject ? subject.id : undefined,
        trails: new Set(
          trails.filter(trail => trail !== null).map(trail => trail.id),
        ),
        professors: new Set(
          professors
            .filter(professor => professor !== null)
            .map(professor => professor.id),
        ),
      })

      await this.projectsRepository.create(project)
      createdProjectId = project.id.toString()
    }

    return right({
      projectId: createdProjectId,
    })
  }
}
