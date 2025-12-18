import { ProfessorsRepository } from '@/@core/application/professors/repositories/professors-repository'
import { SubjectsRepository } from '@/@core/application/subjects/repositories/subjects-repository'
import { TrailsRepository } from '@/@core/application/trails/repositories/trails-repository'
import { UsersRepository } from '@/@core/application/users/repositories/users-repository'
import type { Professor } from '@/@core/domain/projects/entities/professor'
import { Project } from '@/@core/domain/projects/entities/project'
import type { Subject } from '@/@core/domain/projects/entities/subject'
import type { Trail } from '@/@core/domain/projects/entities/trail'
import { ProjectStatus } from '@/@core/domain/projects/value-objects/project-status'
import type { User } from '@/@core/domain/users/entities/user'
import { type Either, left, right } from '@/@shared/kernel/either'
import { ForbiddenError } from '@/@shared/kernel/errors/forbidden.error'
import { ResourceNotFoundError } from '@/@shared/kernel/errors/resource-not-found.error'
import type { UniqueEntityID } from '@/@shared/kernel/kernel/unique-entity-id'
import { Injectable } from '@nestjs/common'
import { ProjectsRepository } from '../repositories/projects-repository'

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

@Injectable()
export class PublishProjectUseCase {
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
    draftId,
  }: PublishProjectUseCaseRequest): Promise<PublishProjectUseCaseResponse> {
    // Validar autor
    const authorValidation = await this.validateAuthor(authorId)
    if (authorValidation.isLeft()) {
      return left(authorValidation.value)
    }
    const student = authorValidation.value

    // Validar disciplina (opcional)
    const subjectValidation = await this.validateSubject(subjectId)
    if (subjectValidation.isLeft()) {
      return left(subjectValidation.value)
    }
    const subject = subjectValidation.value

    // Validar trilhas
    const trailsValidation = await this.validateTrails(trailsIds)
    if (trailsValidation.isLeft()) {
      return left(trailsValidation.value)
    }
    const trails = trailsValidation.value

    // Validar professores (opcional)
    const professorsValidation = await this.validateProfessors(professorsIds)
    if (professorsValidation.isLeft()) {
      return left(professorsValidation.value)
    }
    const professors = professorsValidation.value

    // Processar draft ou criar novo projeto
    let createdProjectId = ''

    if (draftId) {
      const draftValidation = await this.processDraft(
        draftId,
        authorId,
        title,
        description,
        bannerUrl,
        content,
        publishedYear,
        semester,
        allowComments,
        subject,
        trails,
        professors,
      )
      if (draftValidation.isLeft()) {
        return left(draftValidation.value)
      }
      createdProjectId = draftValidation.value
    } else {
      const project = this.createProject(
        title,
        description,
        bannerUrl,
        content,
        publishedYear,
        semester,
        allowComments,
        student.id,
        subject,
        trails,
        professors,
      )

      await this.projectsRepository.create(project)
      createdProjectId = project.id.toString()
    }

    return right({
      projectId: createdProjectId,
    })
  }

  private async validateAuthor(
    authorId: string,
  ): Promise<Either<ForbiddenError | ResourceNotFoundError, User>> {
    if (!authorId) {
      return left(
        new ForbiddenError('You must be logged in to publish a project.'),
      )
    }

    const student = await this.usersRepository.findById(authorId)

    if (!student) {
      return left(new ResourceNotFoundError('Student not found.'))
    }

    return right(student)
  }

  private async validateSubject(
    subjectId?: string,
  ): Promise<Either<ResourceNotFoundError, Subject | null>> {
    if (!subjectId) {
      return right(null)
    }

    const subject = await this.subjectsRepository.findById(subjectId)

    if (!subject) {
      return left(new ResourceNotFoundError('Subject not found.'))
    }

    return right(subject)
  }

  private async validateTrails(
    trailsIds: string[],
  ): Promise<Either<ResourceNotFoundError, Trail[]>> {
    const trails = await Promise.all(
      trailsIds.map(trailId => this.trailsRepository.findById(trailId)),
    )

    if (trails.some(trail => !trail)) {
      return left(new ResourceNotFoundError('Trail not found.'))
    }

    return right(trails.filter((trail): trail is Trail => trail !== null))
  }

  private async validateProfessors(
    professorsIds?: string[],
  ): Promise<Either<ResourceNotFoundError, Professor[]>> {
    if (!professorsIds || professorsIds.length === 0) {
      return right([])
    }

    const professors = await Promise.all(
      professorsIds.map(professorId =>
        this.professorsRepository.findById(professorId),
      ),
    )

    if (professors.some(professor => !professor)) {
      return left(new ResourceNotFoundError('Professor not found.'))
    }

    return right(professors.filter((prof): prof is Professor => prof !== null))
  }

  private async processDraft(
    draftId: string,
    authorId: string,
    title: string,
    description: string,
    bannerUrl: string | undefined,
    content: string | undefined,
    publishedYear: number,
    semester: number,
    allowComments: boolean,
    subject: Subject | null,
    trails: Trail[],
    professors: Professor[],
  ): Promise<Either<ForbiddenError | ResourceNotFoundError, string>> {
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
      draft.defineTrails(trails.map(trail => trail.id))
    }

    if (professors.length > 0) {
      draft.defineProfessors(professors.map(professor => professor.id))
    }

    await this.projectsRepository.save(draft)

    return right(draft.id.toString())
  }

  private createProject(
    title: string,
    description: string,
    bannerUrl: string | undefined,
    content: string | undefined,
    publishedYear: number,
    semester: number,
    allowComments: boolean,
    authorId: UniqueEntityID,
    subject: Subject | null,
    trails: Trail[],
    professors: Professor[],
  ) {
    return Project.create({
      title,
      description,
      bannerUrl,
      content: content || '',
      publishedYear,
      semester,
      allowComments,
      status: ProjectStatus.PUBLISHED,
      authorId,
      subjectId: subject ? subject.id : undefined,
      trails: new Set(trails.map(trail => trail.id)),
      professors: new Set(professors.map(professor => professor.id)),
    })
  }
}
