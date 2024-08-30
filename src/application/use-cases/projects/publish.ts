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
import type { Trail } from '@/domain/entities/trail.entity.ts'
import { InvalidCredentialsError } from '../errors/invalid-credentials.error.ts'
import { ProfessorNotFoundError } from '../professors/errors/professor-not-found.error.ts'
import { SubjectNotFoundError } from '../subjects/errors/subject-not-found.error.ts'
import { TrailNotFoundError } from '../trails/errors/trail-not-found.error.ts'
import { UserNotFoundError } from '../users/errors/user-not-found.error.ts'

interface PublishProjectUseCaseRequest {
  title: string
  description: string
  bannerUrl: string
  content?: string
  publishedYear: number
  status: ProjectStatusEnum
  semester: number
  allowComments: boolean
  authorId: string
  subjectId?: string
  trailsIds: string[]
  professorsIds?: string[]
}

type PublishProjectUseCaseResponse = Either<
  | InvalidCredentialsError
  | SubjectNotFoundError
  | TrailNotFoundError
  | ProfessorNotFoundError
  | UserNotFoundError,
  Project
>

export class PublishProjectUseCase {
  constructor(
    private projectsRepository: ProjectsRepository,
    private subjectsRepository: SubjectsRepository,
    private trailsRepository: TrailsRepository,
    private professorsRepository: ProfessorsRepository,
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
  }: PublishProjectUseCaseRequest): Promise<PublishProjectUseCaseResponse> {
    if (
      !(
        title &&
        description &&
        bannerUrl &&
        publishedYear &&
        status &&
        semester
      )
    ) {
      return left(new InvalidCredentialsError())
    }

    if (subjectId) {
      const subjectExists = await this.subjectsRepository.findById(subjectId)

      if (!subjectExists) {
        return left(new SubjectNotFoundError())
      }
    }

    const trails: Trail[] = []

    if (trailsIds) {
      for (const trailId of trailsIds) {
        const trail = await this.trailsRepository.findById(trailId)

        if (!trail) {
          return left(new TrailNotFoundError())
        }

        trails.push(trail)
      }
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

    const authorExists = await this.usersRepository.findById(authorId)

    if (!authorExists) {
      return left(new UserNotFoundError())
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
