import type { UsersRepository } from '@/@core/domain/authentication/application/repositories/users-repository'
import { type Either, left, right } from '@/@shared/kernel/either'
import { ForbiddenError } from '@/@shared/kernel/errors/forbidden.error'
import { ResourceNotFoundError } from '@/@shared/kernel/errors/resource-not-found.error'
import { UniqueEntityID } from '@/@shared/kernel/kernel/unique-entity-id'
import { Project } from '../../enterprise/entities/project'
import type { Subject } from '../../enterprise/entities/subject'
import { ProjectStatus } from '../../enterprise/value-objects/project-status'
import type { ProfessorsRepository } from '../repositories/professors-repository'
import type { ProjectsRepository } from '../repositories/projects-repository'
import type { SubjectsRepository } from '../repositories/subjects-repository'
import type { TrailsRepository } from '../repositories/trails-repository'

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
    private readonly projectsRepository: ProjectsRepository,
    private readonly usersRepository: UsersRepository,
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
        new ForbiddenError('Você deve estar logado para criar um rascunho.'),
      )
    }

    if (!title) {
      return left(
        new ForbiddenError('Você deve fornecer um título para o rascunho.'),
      )
    }

    const student = await this.usersRepository.findById(authorId)

    if (!student) {
      return left(new ResourceNotFoundError('Estudante não encontrado.'))
    }

    if (!this.subjectsRepository.existsById(new UniqueEntityID(subjectId))) {
      return left(new ResourceNotFoundError('Disciplina não encontrada.'))
    }

    for (const trailId of trailsIds ?? []) {
      if (
        !(await this.trailsRepository.existsById(new UniqueEntityID(trailId)))
      ) {
        return left(new ResourceNotFoundError('Trilha não encontrada.'))
      }
    }

    for (const professorId of professorsIds ?? []) {
      if (
        !(await this.professorsRepository.existsById(
          new UniqueEntityID(professorId),
        ))
      ) {
        return left(new ResourceNotFoundError('Professor não encontrado.'))
      }
    }

    const draft = Project.create({
      title,
      description,
      bannerUrl,
      content,
      publishedYear,
      semester,
      allowComments: allowComments ?? false,
      authorId: student.id,
      subjectId: new UniqueEntityID<Subject>(subjectId),
      status: ProjectStatus.DRAFT,
    })

    draft.defineTrails(
      trailsIds?.map(trailId => new UniqueEntityID(trailId)) ?? [],
    )

    draft.defineProfessors(
      professorsIds?.map(professorId => new UniqueEntityID(professorId)) ?? [],
    )

    await this.projectsRepository.create(draft)

    return right({
      draftId: draft.id.toString(),
    })
  }
}
