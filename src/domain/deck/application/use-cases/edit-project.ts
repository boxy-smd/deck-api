import { type Either, left, right } from '@/core/either.ts'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.ts'
import type {
  Project,
  ProjectStatusEnum,
} from '../../enterprise/entities/project.ts'
import type { Trail } from '../../enterprise/entities/trail.ts'
import type { ProfessorsRepository } from '../repositories/professors-repository.ts'
import type { ProjectsRepository } from '../repositories/projects-repository.ts'
import type { StudentsRepository } from '../repositories/students-repository.ts'
import type { SubjectsRepository } from '../repositories/subjects-repository.ts'
import type { TrailsRepository } from '../repositories/trails-repository.ts'

interface EditProjectUseCaseRequest {
  projectId: string
  title?: string
  description?: string
  bannerUrl?: string
  content?: string
  publishedYear?: number
  status?: ProjectStatusEnum
  semester?: number
  allowComments?: boolean
  authorId: string
  subjectId?: string
  trailsIds?: string[]
  professorsIds?: string[]
}

type EditProjectUseCaseResponse = Either<ResourceNotFoundError, Project>

export class EditProjectUseCase {
  constructor(
    private readonly projectsRepository: ProjectsRepository,
    private readonly studentsRepository: StudentsRepository,
    private readonly subjectsRepository: SubjectsRepository,
    private readonly trailsRepository: TrailsRepository,
    private readonly professorsRepository: ProfessorsRepository,
  ) {}

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: This function is complex by nature
  async execute({
    projectId,
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
  }: EditProjectUseCaseRequest): Promise<EditProjectUseCaseResponse> {
    const student = await this.studentsRepository.findById(authorId)

    if (!student) {
      return left(new ResourceNotFoundError('Student not found.'))
    }

    const project = await this.projectsRepository.findById(projectId)

    if (!project) {
      return left(new ResourceNotFoundError('Project not found.'))
    }

    project.title = title ?? project.title
    project.description = description ?? project.description
    project.bannerUrl = bannerUrl ?? project.bannerUrl
    project.content = content ?? project.content
    project.publishedYear = publishedYear ?? project.publishedYear
    project.status = status ?? project.status
    project.semester = semester ?? project.semester
    project.allowComments = allowComments ?? project.allowComments

    if (subjectId) {
      const subject = await this.subjectsRepository.findById(subjectId)

      if (!subject) {
        return left(new ResourceNotFoundError('Subject not found.'))
      }

      project.subjectId = subject.id
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

    project.trails = trails.filter(trail => trail !== null) as Trail[]

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

    project.professors = professors.filter(professor => professor !== null)

    await this.projectsRepository.save(project)

    return right(project)
  }
}
