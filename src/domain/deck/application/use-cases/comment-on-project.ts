import { type Either, left, right } from '@/core/either.ts'
import { ForbiddenError } from '@/core/errors/forbidden.error.ts'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error.ts'
import { Comment } from '../../enterprise/entities/comment.ts'
import type { CommentsRepository } from '../repositories/comments-repository.ts'
import type { ProjectsRepository } from '../repositories/projects-repository.ts'
import type { StudentsRepository } from '../repositories/students-repository.ts'

interface CommentOnProjectUseCaseRequest {
  content: string
  authorId: string
  projectId: string
}

type CommentOnProjectUseCaseResponse = Either<
  ForbiddenError | ResourceNotFoundError,
  {
    commentId: string
  }
>

export class CommentOnProjectUseCase {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly projectsRepository: ProjectsRepository,
    private readonly subjectsRepository: StudentsRepository,
  ) {}

  async execute({
    authorId,
    projectId,
    content,
  }: CommentOnProjectUseCaseRequest): Promise<CommentOnProjectUseCaseResponse> {
    if (!authorId) {
      return left(
        new ForbiddenError('You must be logged in to comment on a project.'),
      )
    }

    const author = await this.subjectsRepository.findById(authorId)

    if (!author) {
      return left(new ResourceNotFoundError('Author not found.'))
    }

    const project = await this.projectsRepository.findById(projectId)

    if (!project) {
      return left(new ResourceNotFoundError('Project not found.'))
    }

    const comment = Comment.create({
      content,
      authorId: author.id,
      projectId: project.id,
    })

    await this.commentsRepository.create(comment)

    return right({
      commentId: comment.id.toString(),
    })
  }
}
