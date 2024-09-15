import { type Either, left, right } from '@/core/either.ts'
import { ForbiddenError } from '@/core/errors/forbidden.error.ts'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error.ts'
import type { CommentsRepository } from '../repositories/comments-repository.ts'
import type { ProjectsRepository } from '../repositories/projects-repository.ts'
import type { StudentsRepository } from '../repositories/students-repository.ts'

interface DeleteCommentUseCaseRequest {
  authorId: string
  projectId: string
  commentId: string
}

type DeleteCommentUseCaseResponse = Either<
  ForbiddenError | ResourceNotFoundError,
  void
>

export class DeleteCommentUseCase {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly studentsRepository: StudentsRepository,
    private readonly projectsRepository: ProjectsRepository,
  ) {}

  async execute({
    authorId,
    projectId,
    commentId,
  }: DeleteCommentUseCaseRequest): Promise<DeleteCommentUseCaseResponse> {
    if (!authorId) {
      return left(
        new ForbiddenError('You must be logged in to delete a comment.'),
      )
    }

    const author = await this.studentsRepository.findById(authorId)

    if (!author) {
      return left(new ResourceNotFoundError('Author not found.'))
    }

    const comment = await this.commentsRepository.findById(commentId)

    if (!comment) {
      return left(new ResourceNotFoundError('Comment not found.'))
    }

    const project = await this.projectsRepository.findById(projectId)

    if (!project) {
      return left(new ResourceNotFoundError('Project not found.'))
    }

    if (
      authorId !== comment.authorId.toString() ||
      authorId !== project.authorId.toString()
    ) {
      return left(
        new ForbiddenError('You are not allowed to delete this comment.'),
      )
    }

    await this.commentsRepository.delete(commentId)

    return right(undefined)
  }
}
