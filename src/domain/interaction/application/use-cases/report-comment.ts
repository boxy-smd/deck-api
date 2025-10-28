import type { UsersRepository } from '@/domain/authentication/application/repositories/users-repository.ts'
import type { ProjectsRepository } from '@/domain/projects/application/repositories/projects-repository.ts'
import { type Either, left, right } from '@/shared/either.ts'
import { ForbiddenError } from '@/shared/errors/forbidden.error.ts'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found.error.ts'
import { UniqueEntityID } from '@/shared/kernel/unique-entity-id.ts'
import { Report } from '../../enterprise/entities/report.ts'

interface ReportCommentUseCaseRequest {
  content: string
  authorId: string
  projectId: string
  commentId: string
}

type ReportCommentUseCaseResponse = Either<
  ForbiddenError | ResourceNotFoundError,
  void
>

export class ReportCommentUseCase {
  constructor(
    private studentsRepository: UsersRepository,
    private projectsRepository: ProjectsRepository,
  ) {}

  async execute({
    content,
    authorId,
    projectId,
    commentId,
  }: ReportCommentUseCaseRequest): Promise<ReportCommentUseCaseResponse> {
    if (!authorId) {
      return left(
        new ForbiddenError('You must be logged in to report a comment.'),
      )
    }

    const project = await this.projectsRepository.findById(
      UniqueEntityID.create(projectId),
    )

    if (!project) {
      return left(new ResourceNotFoundError('Project not found.'))
    }

    const comment = project.comments.find(comment =>
      comment.id.equals(UniqueEntityID.create(commentId)),
    )

    if (!comment) {
      return left(new ResourceNotFoundError('Comment not found.'))
    }

    const student = await this.studentsRepository.findById(
      UniqueEntityID.create(authorId),
    )

    if (!student) {
      return left(new ResourceNotFoundError('Student not found.'))
    }

    const report = Report.create({
      content,
      authorId: student.id,
      commentId: comment.id,
      isResolved: false,
    })

    comment.reports.push(report)

    await this.projectsRepository.save(project)

    return right(undefined)
  }
}
