import type { ProfessorsRepository } from '@/application/repositories/professors-repository.ts'
import type { ProjectsRepository } from '@/application/repositories/projects-repository.ts'
import type { SubjectsRepository } from '@/application/repositories/subjects-repository.ts'
import type { TrailsRepository } from '@/application/repositories/trails-repository.ts'
import type { UsersRepository } from '@/application/repositories/users-repository.ts'
import { type Either, left, right } from '@/domain/core/logic/either.ts'
import {
  Project,
  type ProjectStatusEnum,
} from '@/domain/entities/project.entity.ts'
import { InvalidCredentialsError } from '../errors/invalid-credentials.error.ts'
import { ProfessorNotFoundError } from '../professors/errors/professor-not-found.error.ts'
import { SubjectNotFoundError } from '../subjects/errors/subject-not-found.error.ts'
import { TrailNotFoundError } from '../trails/errors/trail-not-found.error.ts'
import { UserNotFoundError } from '../users/errors/user-not-found.error.ts'

interface CreateProjectUseCaseRequest {
  title: string
  description: string
  bannerUrl: string
  content?: string
  publishedYear: number
  status: ProjectStatusEnum
  semester: number
  allowComments: boolean
  authorId: string
  subjectId: string
  trailsIds?: string[]
  professorsIds?: string[]
}

type CreateProjectUseCaseResponse = Either<
  | InvalidCredentialsError
  | SubjectNotFoundError
  | ProfessorNotFoundError
  | TrailNotFoundError
  | UserNotFoundError,
  Project
>

export class CreateProjectUseCase {
  constructor(
    private projectsRepository: ProjectsRepository,
    private trailsRepository: TrailsRepository,
    private professorsRepository: ProfessorsRepository,
    private subjectsRepository: SubjectsRepository,
    private usersRepository: UsersRepository,
  ) {}

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation>
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
  }: CreateProjectUseCaseRequest): Promise<CreateProjectUseCaseResponse> {
    if (
      !(
        title &&
        description &&
        bannerUrl &&
        publishedYear &&
        status &&
        semester &&
        authorId &&
        subjectId
      )
    ) {
      return left(new InvalidCredentialsError())
    }

    const author = await this.usersRepository.findById(authorId)
    if (!author) {
      return left(new UserNotFoundError())
    }

    const subject = await this.subjectsRepository.findById(subjectId)
    if (!subject) {
      return left(new SubjectNotFoundError())
    }

    const professors = []
    if (professorsIds) {
      for (const professorId of professorsIds) {
        const professor = await this.professorsRepository.findById(professorId)
        if (!professor) {
          return left(new ProfessorNotFoundError())
        }
        professors.push(professor)
      }
    }

    const trails = []
    if (trailsIds) {
      for (const trailId of trailsIds) {
        const trail = await this.trailsRepository.findById(trailId)
        if (!trail) {
          return left(new TrailNotFoundError())
        }
        trails.push(trail)
      }
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
      authorId,
      subjectId,
      trails,
      professors,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await this.projectsRepository.create(project)

    return right(project)
  }
}
